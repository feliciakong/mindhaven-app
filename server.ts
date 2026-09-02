import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in process.env');
  }
  return new GoogleGenAI({ apiKey });
};

// Model fallback ladder for resilience
const MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

async function generateWithFallback(systemInstruction: string, contents: any, responseSchema?: any) {
  const ai = getGeminiClient();
  let lastError: any = null;

  for (const model of MODELS) {
    try {
      const config: any = { systemInstruction };
      if (responseSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = responseSchema;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Gemini model ${model} attempt failed:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Chat completion endpoint for reflection session
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userPrompt, mood, userDisplayName } = req.body;

    if (!userPrompt) {
      res.status(400).json({ error: 'userPrompt is required' });
      return;
    }

    const systemInstruction = `You are MindHaven, a compassionate, empathetic, and Socratic AI Reflection Journal Companion.
Your purpose is to help the user (${userDisplayName || 'Friend'}) deeply process their thoughts, feelings, emotions, and experiences.

Guidelines:
1. Provide warm, grounding, and supportive insights without being preachy or overly mechanical.
2. Ask 1-2 open-ended Socratic questions to encourage deeper self-reflection.
3. Validate their feelings gently. Current mood context: "${mood || 'Reflective'}".
4. Keep responses clear, beautifully structured (using markdown bullet points or short paragraphs where helpful), and around 150-250 words.
5. Do not give direct unsolicited advice unless asked, but help the user uncover their own clarity and action steps.`;

    // Format chat history for Gemini contents
    const contents: any[] = [];
    
    if (Array.isArray(messages)) {
      messages.forEach((msg: any) => {
        if (msg.text && (msg.sender === 'user' || msg.sender === 'gemini')) {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          });
        }
      });
    }

    // Append current prompt
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const reply = await generateWithFallback(systemInstruction, contents);
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to process reflection with Gemini AI',
      details: error.message || String(error),
    });
  }
});

// Session Summarization & Insights endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { messages, mood } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required for summarization' });
      return;
    }

    const systemInstruction = `You are MindHaven's AI Insight Analyst.
Analyze the provided journal/reflection transcript and generate a structured summary including:
1. A concise overview summary of the reflection session (2-3 sentences).
2. Mood Analysis (identifying emotional themes).
3. 3 Key Insights or realizations from the session.
4. 2-3 Actionable Steps or gentle takeaway commitments for the user.
5. 1 Suggested Socratic prompt for their next reflection.`;

    const transcript = messages
      .map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Please analyze this reflection session transcript:\n\nMood tag: ${mood || 'Not specified'}\n\nTranscript:\n${transcript}`,
          },
        ],
      },
    ];

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        moodAnalysis: { type: Type.STRING },
        keyInsights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        actionSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        suggestedPromptForNextTime: { type: Type.STRING },
      },
      required: ['summary', 'moodAnalysis', 'keyInsights', 'actionSteps'],
    };

    const jsonString = await generateWithFallback(systemInstruction, contents, responseSchema);
    const parsedData = JSON.parse(jsonString);

    res.json({ summary: parsedData });
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    res.status(500).json({
      error: 'Failed to summarize reflection session',
      details: error.message || String(error),
    });
  }
});

// Dynamic Reflection Prompt Generator
app.post('/api/prompts', async (req, res) => {
  try {
    const { category } = req.body;

    const systemInstruction = `You are a thoughtful journal prompt generator.
Generate 3 distinct, deeply engaging, and empathetic Socratic reflection prompts for the category "${category || 'General'}".
Keep each prompt under 25 words.`;

    const contents = [{ role: 'user', parts: [{ text: `Category: ${category || 'General'}` }] }];

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        prompts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['prompts'],
    };

    const jsonString = await generateWithFallback(systemInstruction, contents, responseSchema);
    const parsed = JSON.parse(jsonString);

    res.json({ prompts: parsed.prompts || [] });
  } catch (error: any) {
    console.error('Error in /api/prompts:', error);
    res.status(500).json({
      error: 'Failed to generate prompts',
      details: error.message || String(error),
    });
  }
});

// Serve frontend in development or production
async function setupServer() {
  const distPath = path.join(process.cwd(), 'dist');

  if (process.env.NODE_ENV !== 'production') {
    // Development mode: Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets
    app.use('/assets', express.static(path.join(distPath, 'assets')));
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MindHaven server running on ${PORT}`);
  });
}

setupServer();

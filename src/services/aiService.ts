import { sanitizePII } from '../utils/piiSanitizer';

export interface AIAnalysisResult {
  insight: string;
  detectedMood: string;
  suggestedTitle?: string;
}

export async function analyzeReflection(rawText: string): Promise<AIAnalysisResult> {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
  const sanitizedText = sanitizePII(rawText);

  if (!apiKey) {
    return {
      insight: "Take a gentle breath and acknowledge the feelings you've captured here today.",
      detectedMood: "Reflective",
      suggestedTitle: "Personal Reflection"
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an empathetic, highly perceptive personal reflection guide. 
Analyze this user journal entry deeply and specifically:
"${sanitizedText}"

Provide:
1. A highly tailored, unique, 2-3 sentence psychological or mindful insight that speaks directly to the specific technical tasks, struggles, or breakthroughs mentioned in the text (avoid generic boilerplate).
2. An accurate mood chosen strictly from ONE of these exact options: Reflective, Calm, Grateful, Anxious, Inspired, Overwhelmed. (If the user describes a stressful technical crisis or troubleshooting hurdle, lean toward Overwhelmed or Anxious rather than a generic tag).
3. A concise 3-5 word title summarizing the entry.

You must respond strictly in JSON format with this exact structure:
{
  "insight": "your custom tailored insight here",
  "detectedMood": "one of the allowed moods",
  "suggestedTitle": "concise title"
}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!candidateText) {
      throw new Error("No response text received from Gemini API");
    }

    const result = JSON.parse(candidateText);
    return {
      insight: result.insight || "Take a moment to appreciate the depth of your reflection today.",
      detectedMood: ["Reflective", "Calm", "Grateful", "Anxious", "Inspired", "Overwhelmed"].includes(result.detectedMood) 
        ? result.detectedMood 
        : "Reflective",
      suggestedTitle: result.suggestedTitle || "Personal Reflection"
    };
  } catch (error) {
    console.error('Gemini API Error details:', error);
    return {
      insight: "Every hurdle overcome is another step forward in your journey. Allow yourself space to rest and process.",
      detectedMood: "Reflective",
      suggestedTitle: "Personal Reflection"
    };
  }
}
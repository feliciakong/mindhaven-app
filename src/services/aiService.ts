import { sanitizePII } from '../utils/piiSanitizer';

export interface AIAnalysisResult {
  insight: string;
  detectedMood: string;
}

export async function analyzeReflection(rawText: string): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const sanitizedText = sanitizePII(rawText);

  if (!apiKey) {
    return {
      insight: "Reflection logged successfully. (Note: Add VITE_GEMINI_API_KEY to enable automated AI insights).",
      detectedMood: "Reflective"
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an empathetic, grounded personal journal assistant. Analyze this user reflection and respond with concise support (max 3 sentences) followed by an estimated single-word mood label from: [Reflective, Calm, Grateful, Anxious, Inspired, Overwhelmed].

User entry: "${sanitizedText}"

Format your output strictly as:
INSIGHT: <your supportive reflection>
MOOD: <one of the single-word mood labels>`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const insightMatch = replyText.match(/INSIGHT:\s*(.*)/i);
    const moodMatch = replyText.match(/MOOD:\s*(\w+)/i);

    return {
      insight: insightMatch ? insightMatch[1].trim() : replyText || "Thank you for sharing your thoughts.",
      detectedMood: moodMatch ? moodMatch[1].trim() : "Reflective"
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      insight: "Your reflection has been safely stored.",
      detectedMood: "Reflective"
    };
  }
}

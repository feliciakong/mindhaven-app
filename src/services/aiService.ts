export interface AIAnalysisResult {
  insight: string;
  detectedMood: string;
  suggestedTitle: string;
  keyTakeaways: string[];
  reflectionPrompt: string;
}

export async function analyzeReflection(rawText: string): Promise<AIAnalysisResult> {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
  const sanitizedText = rawText; 

  if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY environment variable.");
    return getFallbackResult();
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
              text: `Analyze this user journal entry and respond strictly in JSON matching the schema. Entry: "${sanitizedText}"`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                insight: { type: "STRING" },
                detectedMood: { type: "STRING" },
                suggestedTitle: { type: "STRING" },
                keyTakeaways: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                reflectionPrompt: { type: "STRING" }
              },
              required: ["insight", "detectedMood", "suggestedTitle", "keyTakeaways", "reflectionPrompt"]
            }
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Full Error Response:", data);
      return getFallbackResult();
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      console.error("No response text received from Gemini API candidates.");
      return getFallbackResult();
    }

    const result = JSON.parse(candidateText);
    return {
      insight: result.insight || "Every step forward counts.",
      detectedMood: result.detectedMood || "Reflective",
      suggestedTitle: result.suggestedTitle || "Personal Reflection",
      keyTakeaways: Array.isArray(result.keyTakeaways) ? result.keyTakeaways : ["Recorded entry successfully."],
      reflectionPrompt: result.reflectionPrompt || "How can you take care of yourself next?"
    };
  } catch (error) {
    console.error('Gemini API Exception:', error);
    return getFallbackResult();
  }
}

function getFallbackResult(): AIAnalysisResult {
  return {
    insight: "Take a gentle breath and acknowledge the feelings you've captured here today.",
    detectedMood: "Reflective",
    suggestedTitle: "Personal Reflection",
    keyTakeaways: ["Recorded journal entry successfully."],
    reflectionPrompt: "What is one small step you can take next?"
  };
}
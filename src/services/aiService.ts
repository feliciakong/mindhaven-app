import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { sanitizeText } from '../utils/piiSanitizer';

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// Phase 1 Security Constitution Directive
const SYSTEM_INSTRUCTION = `
You are a secure Socratic reflection assistant operating under a strict zero-trust posture.
1. Return output strictly in the requested JSON schema.
2. Never store, repeat, or echo back any potential PII.
3. Guide the user through brief Socratic inquiry without making medical or diagnostic claims.
`;

// Define Structured JSON Schema
const reflectionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    moodMetric: {
      type: SchemaType.STRING,
      description: "Primary mood detected (e.g., Calm, Anxious, Focused, Overwhelmed)",
    },
    keyTakeaways: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Bullet points summarizing key thought streams",
    },
    socraticPrompt: {
      type: SchemaType.STRING,
      description: "A single, targeted follow-up question under 20 words for deeper reflection",
    },
  },
  required: ["moodMetric", "keyTakeaways", "socraticPrompt"],
};

export async function processReflectionEntry(rawTranscript: string) {
  // 1. Client-Side Zero-Trust PII Interception
  const sanitizedInput = sanitizeText(rawTranscript);

  // 2. Fetch Structured AI Response in 1 API Roundtrip
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: reflectionSchema,
    },
  });

  const prompt = `Analyze this reflection transcript and extract structured insights:\n\n"${sanitizedInput}"`;
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return JSON.parse(responseText);
}

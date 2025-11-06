import { GoogleGenAI } from "@google/genai/node";

export const GEMINI_MODEL_NAME = "gemini-flash-latest";

type GenAIClient = GoogleGenAI;

let cachedClient: GenAIClient | null = null;

function resolveApiKey(): string {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set.");
  }
  return apiKey;
}

export function getGenAIClient(): GenAIClient {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = resolveApiKey();

  cachedClient = new GoogleGenAI({ apiKey });

  return cachedClient;
}

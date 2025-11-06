import { GoogleAIFileManager, GoogleGenerativeAI } from "@google/genai";

export const GEMINI_MODEL_NAME = "gemini-flash-latest";

type GenAIClients = {
  modelClient: GoogleGenerativeAI;
  fileManager: GoogleAIFileManager;
};

let cachedClients: GenAIClients | null = null;

function resolveApiKey(): string {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set.");
  }
  return apiKey;
}

export function getGenAIClients(): GenAIClients {
  if (cachedClients) {
    return cachedClients;
  }

  const apiKey = resolveApiKey();

  cachedClients = {
    modelClient: new GoogleGenerativeAI({ apiKey }),
    fileManager: new GoogleAIFileManager({ apiKey }),
  };

  return cachedClients;
}

import { GoogleGenAI } from "@google/genai";

export const PRIMARY_MODEL = "models/gemini-2.5-flash-preview-05-20";
export const FALLBACK_MODEL = "models/gemini-2.0-flash";
export const DEFAULT_MODEL = PRIMARY_MODEL;

export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  thinkingConfig: {
    thinkingBudget: 0,
  },
};

const parseApiKeys = (): string[] => {
  const keysEnv = process.env.GEMINI_API_KEY || "";
  const keys = keysEnv
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);

  if (keys.length === 0) {
    throw new Error(
      "GEMINI_API_KEY environment variable must contain at least one valid API key",
    );
  }

  return keys;
};

export const API_KEYS = parseApiKeys();

const selectKeyIndex = (): number => {
  return Math.floor(Math.random() * API_KEYS.length);
};

export interface GeminiContext {
  client: GoogleGenAI;
  keyIndex: number;
}

export const createGeminiContext = (): GeminiContext => {
  const keyIndex = selectKeyIndex();
  return {
    client: new GoogleGenAI({ apiKey: API_KEYS[keyIndex] }),
    keyIndex,
  };
};

export const ai = new GoogleGenAI({
  apiKey: API_KEYS[0],
});

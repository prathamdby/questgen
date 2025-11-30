import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const DEFAULT_MODEL = "models/gemini-flash-lite-latest";

export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  thinkingConfig: {
    thinkingBudget: 0,
  },
};

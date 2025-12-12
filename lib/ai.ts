import { GoogleGenAI } from "@google/genai";

export const PRIMARY_MODEL = "models/gemini-flash-latest";
export const FALLBACK_MODEL = "models/gemini-flash-lite-latest";
export const DEFAULT_MODEL = PRIMARY_MODEL;

export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  thinkingConfig: {
    thinkingBudget: 0,
  },
};

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

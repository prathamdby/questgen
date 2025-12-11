import { ApiError } from "@google/genai";
import {
  DEFAULT_GENERATION_CONFIG,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  type GeminiContext,
} from "@/lib/ai";

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.status === 429 || error.status === 500 || error.status === 503;
  }
  return false;
};

export const generateWithRetry = async <T>(
  ctx: GeminiContext,
  fn: (model: string, config: typeof DEFAULT_GENERATION_CONFIG) => Promise<T>,
): Promise<T> => {
  try {
    return await fn(PRIMARY_MODEL, DEFAULT_GENERATION_CONFIG);
  } catch (error) {
    if (isRetryableError(error)) {
      try {
        return await fn(FALLBACK_MODEL, DEFAULT_GENERATION_CONFIG);
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
};

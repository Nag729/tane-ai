import Anthropic from "@anthropic-ai/sdk";
import { Model } from "@anthropic-ai/sdk/resources";

/**
 * Anthropic クライアント
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * モデル ID
 */
export const MODEL_ID = "claude-opus-4-20250514" as const satisfies Model;

/**
 * リトライ設定
 */
type RetryConfig = {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
};

export const retryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Exponential backoff でリトライ
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = retryConfig
): Promise<T> {
  let lastError: Error | undefined;
  let delay = config.initialDelayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === config.maxRetries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, config.maxDelayMs);
    }
  }

  throw lastError;
}

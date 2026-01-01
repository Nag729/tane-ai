import { createAnthropic } from "@ai-sdk/anthropic";

/**
 * Anthropic クライアントの初期化
 * Vercel AI SDK の Anthropic プロバイダーを使用
 */
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * モデル ID
 * Extended Thinking は generateObject の providerOptions で設定
 */
export const MODEL_ID = "claude-opus-4-20250514" as const;

/**
 * リトライ設定
 */
export const retryConfig: {
  readonly maxRetries: number;
  readonly initialDelayMs: number;
  readonly maxDelayMs: number;
} = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Exponential backoff でリトライ
 */
export async function withRetry<T>(fn: () => Promise<T>, config = retryConfig): Promise<T> {
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

      // Wait before retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, config.maxDelayMs);
    }
  }

  throw lastError;
}

import Anthropic from "@anthropic-ai/sdk";
import { Model } from "@anthropic-ai/sdk/resources";

/**
 * Anthropic クライアント
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * モデル設定（用途別）
 * Sonnet 4 を使用して速度を優先
 */
export const MODEL_CONFIG = {
  /** 質問生成: 軽量タスク */
  question: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 4000,
    thinkingBudget: 3000,
  },
  /** 出力生成: メインタスク */
  output: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 8000,
    thinkingBudget: 4000,
  },
  /** 再生成: フィードバック反映 */
  regenerate: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 4000,
    thinkingBudget: 0, // 再生成時は thinking 不要
  },
  /** フィードバックレビュー: AI による批評 */
  feedbackReview: {
    model: "claude-sonnet-4-20250514",
    maxTokens: 8000,
    thinkingBudget: 4000,
  },
} as const satisfies {
  [key: string]: { model: Model; maxTokens: number; thinkingBudget: number };
};

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

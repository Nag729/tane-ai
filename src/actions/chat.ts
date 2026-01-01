"use server";

import { generateText, Output } from "ai";
import { z } from "zod";
import { anthropic, withRetry, MODEL_ID } from "@/lib/anthropic";
import { getQuestionSystemPrompt, getOutputSystemPrompt } from "@/lib/prompts";
import type { HorensoType, AIMessage, ChatMessage, StructuredOutput } from "@/types";

/**
 * AI レスポンスのスキーマ（質問生成用）
 */
const questionResponseSchema = z.object({
  intro: z.string().describe("短い励まし・相槌（例：いいね！、なるほど〜）"),
  questions: z
    .array(
      z.object({
        id: z.string().describe("質問のユニークID"),
        content: z.string().describe("質問文"),
        options: z
          .array(
            z.object({
              id: z.string().describe("選択肢のユニークID"),
              label: z.string().describe("選択肢のラベル"),
            })
          )
          .describe("選択肢（2〜4個）"),
        multiSelect: z.boolean().describe("複数選択可能かどうか"),
        customInputPlaceholder: z.string().optional().describe("カスタム入力欄のプレースホルダー"),
      })
    )
    .describe("質問リスト（1〜2個）"),
  ready: z.boolean().describe("十分な情報が集まったかどうか"),
});

/**
 * 構造化出力のスキーマ
 */
const outputResponseSchema = z.object({
  content: z.string().describe("Markdown形式の出力"),
});

/**
 * チャット履歴をプロンプト用のテキストに変換
 */
function formatChatHistory(messages: ChatMessage[]): string {
  return messages
    .map((msg) => {
      if (msg.role === "ai") {
        const intro = msg.message.intro || "";
        const questions = msg.message.questions.map((q) => `質問: ${q.content}`).join("\n");
        return `AI: ${intro}\n${questions}`;
      } else {
        const answers = msg.answer.answers
          .map((a) => {
            const selected = a.selectedOptionIds.join(", ");
            const custom = a.customInput ? ` (補足: ${a.customInput})` : "";
            return `回答: ${selected}${custom}`;
          })
          .join("\n");
        const customInput = msg.answer.customInput
          ? `\nユーザー入力: ${msg.answer.customInput}`
          : "";
        return `ユーザー: ${answers}${customInput}`;
      }
    })
    .join("\n\n");
}

/**
 * 初期入力から最初の質問を生成
 */
export async function generateFirstQuestion(
  type: HorensoType,
  initialInput: { topic: string; recipient: string; detail: string }
): Promise<AIMessage> {
  const systemPrompt = getQuestionSystemPrompt(type);

  const userPrompt = `ユーザーの初期入力:
- 何を伝えたい: ${initialInput.topic}
- 誰に: ${initialInput.recipient}
- 状況・背景: ${initialInput.detail}

この情報を元に、より詳しく整理するための質問を生成してください。`;

  const result = await withRetry(async () => {
    const { output } = await generateText({
      model: anthropic(MODEL_ID),
      output: Output.object({ schema: questionResponseSchema }),
      system: systemPrompt,
      prompt: userPrompt,
      // Extended Thinking を有効化（初回質問生成）
      providerOptions: {
        anthropic: {
          thinking: {
            type: "enabled",
            budgetTokens: 5000,
          },
        },
      },
    });
    if (!output) {
      throw new Error("No output from AI");
    }
    return output;
  });

  return {
    id: `msg-${Date.now()}`,
    intro: result.intro,
    questions: result.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => ({ ...o })),
    })),
  };
}

/**
 * 対話履歴から次の質問を生成（または完了判定）
 */
export async function generateNextQuestion(
  type: HorensoType,
  messages: ChatMessage[]
): Promise<{ message: AIMessage; ready: boolean }> {
  const systemPrompt = getQuestionSystemPrompt(type);
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

この対話を踏まえて：
1. 十分な情報が集まっていれば ready: true を返す
2. まだ必要な情報があれば、追加の質問を生成する`;

  const result = await withRetry(async () => {
    const { output } = await generateText({
      model: anthropic(MODEL_ID),
      output: Output.object({ schema: questionResponseSchema }),
      system: systemPrompt,
      prompt: userPrompt,
      // 対話中は Extended Thinking を使わない（速度重視）
    });
    if (!output) {
      throw new Error("No output from AI");
    }
    return output;
  });

  return {
    message: {
      id: `msg-${Date.now()}`,
      intro: result.intro,
      questions: result.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({ ...o })),
      })),
    },
    ready: result.ready,
  };
}

/**
 * 対話履歴から構造化された出力を生成
 */
export async function generateOutput(
  type: HorensoType,
  messages: ChatMessage[]
): Promise<StructuredOutput> {
  const systemPrompt = getOutputSystemPrompt(type);
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

この対話で集まった情報を元に、構造化された文章を生成してください。`;

  const result = await withRetry(async () => {
    const { output } = await generateText({
      model: anthropic(MODEL_ID),
      output: Output.object({ schema: outputResponseSchema }),
      system: systemPrompt,
      prompt: userPrompt,
      // Extended Thinking を有効化（最終出力生成）
      providerOptions: {
        anthropic: {
          thinking: {
            type: "enabled",
            budgetTokens: 8000,
          },
        },
      },
    });
    if (!output) {
      throw new Error("No output from AI");
    }
    return output;
  });

  return {
    content: result.content,
  };
}

/**
 * フィードバックを反映して出力を再生成
 */
export async function regenerateOutput(
  type: HorensoType,
  messages: ChatMessage[],
  previousOutput: StructuredOutput,
  feedback: string
): Promise<StructuredOutput> {
  const systemPrompt = getOutputSystemPrompt(type);
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

前回の出力:
${previousOutput.content}

ユーザーからのフィードバック:
${feedback}

フィードバックを反映して、改善された文章を生成してください。`;

  const result = await withRetry(async () => {
    const { output } = await generateText({
      model: anthropic(MODEL_ID),
      output: Output.object({ schema: outputResponseSchema }),
      system: systemPrompt,
      prompt: userPrompt,
    });
    if (!output) {
      throw new Error("No output from AI");
    }
    return output;
  });

  return {
    content: result.content,
  };
}

"use server";

import type { ContentBlock } from "@anthropic-ai/sdk/resources/messages";
import { anthropic, withRetry, MODEL_ID } from "@/lib/anthropic";
import { getQuestionSystemPrompt, getOutputSystemPrompt } from "@/lib/prompts";
import type { HorensoType, AIMessage, ChatMessage, StructuredOutput } from "@/types";

/**
 * レスポンスからテキストを抽出
 */
function extractText(content: ContentBlock[]): string {
  const textBlock = content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

/**
 * JSON をパース（コードブロックにも対応）
 */
function parseJSON<T>(text: string): T {
  // ```json ... ``` を除去
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}

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

/** 質問生成のレスポンス型 */
type QuestionResponse = {
  intro: string;
  questions: {
    id: string;
    content: string;
    options: { id: string; label: string }[];
    multiSelect: boolean;
    customInputPlaceholder?: string;
  }[];
  ready: boolean;
};

/** JSON 出力の指示 */
const JSON_INSTRUCTION = `
必ず以下の JSON 形式で出力してください（他のテキストは不要）:
{
  "intro": "短い励まし・相槌（例：いいね！、なるほど〜）",
  "questions": [
    {
      "id": "q1",
      "content": "質問文",
      "options": [
        { "id": "opt1", "label": "選択肢1" },
        { "id": "opt2", "label": "選択肢2" }
      ],
      "multiSelect": false,
      "customInputPlaceholder": "自由入力のプレースホルダー（任意）"
    }
  ],
  "ready": false
}
`;

/**
 * 初期入力から最初の質問を生成（Extended Thinking 有効）
 */
export async function generateFirstQuestion(
  type: HorensoType,
  initialInput: { topic: string; recipient: string; detail: string }
): Promise<AIMessage> {
  const systemPrompt = getQuestionSystemPrompt(type) + JSON_INSTRUCTION;

  const userPrompt = `ユーザーの初期入力:
- 何を伝えたい: ${initialInput.topic}
- 誰に: ${initialInput.recipient}
- 状況・背景: ${initialInput.detail}

この情報を元に、より詳しく整理するための質問を生成してください。`;

  const result = await withRetry(async () => {
    const response = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: 16000,
      thinking: {
        type: "enabled",
        budget_tokens: 5000,
      },
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = extractText(response.content);
    return parseJSON<QuestionResponse>(text);
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
 * 対話履歴から次の質問を生成（速度重視で Extended Thinking なし）
 */
export async function generateNextQuestion(
  type: HorensoType,
  messages: ChatMessage[]
): Promise<{ message: AIMessage; ready: boolean }> {
  const systemPrompt = getQuestionSystemPrompt(type) + JSON_INSTRUCTION;
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

この対話を踏まえて：
1. 十分な情報が集まっていれば ready: true を返す
2. まだ必要な情報があれば、追加の質問を生成する`;

  const result = await withRetry(async () => {
    const response = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = extractText(response.content);
    return parseJSON<QuestionResponse>(text);
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

/** Markdown 出力の指示 */
const MARKDOWN_INSTRUCTION = `
必ず以下の JSON 形式で出力してください（他のテキストは不要）:
{
  "content": "Markdown形式の出力内容"
}
`;

/** 出力レスポンス型 */
type OutputResponse = {
  content: string;
};

/**
 * 対話履歴から構造化された出力を生成（Extended Thinking 有効）
 */
export async function generateOutput(
  type: HorensoType,
  messages: ChatMessage[]
): Promise<StructuredOutput> {
  const systemPrompt = getOutputSystemPrompt(type) + MARKDOWN_INSTRUCTION;
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

この対話で集まった情報を元に、構造化された文章を生成してください。`;

  const result = await withRetry(async () => {
    const response = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: 16000,
      thinking: {
        type: "enabled",
        budget_tokens: 8000,
      },
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = extractText(response.content);
    return parseJSON<OutputResponse>(text);
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
  const systemPrompt = getOutputSystemPrompt(type) + MARKDOWN_INSTRUCTION;
  const chatHistory = formatChatHistory(messages);

  const userPrompt = `これまでの対話:
${chatHistory}

前回の出力:
${previousOutput.content}

ユーザーからのフィードバック:
${feedback}

フィードバックを反映して、改善された文章を生成してください。`;

  const result = await withRetry(async () => {
    const response = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = extractText(response.content);
    return parseJSON<OutputResponse>(text);
  });

  return {
    content: result.content,
  };
}

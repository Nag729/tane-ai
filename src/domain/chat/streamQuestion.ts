import { anthropic, MODEL_CONFIG } from "@/lib/anthropic";
import { getQuestionSystemPrompt } from "@/lib/prompts";
import type { MeetingType, InitialInputData } from "@/types";

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

function buildUserPrompt(initialInput?: InitialInputData, messages?: unknown[]): string {
  if (initialInput) {
    const supplementsText =
      initialInput.supplements.length > 0
        ? initialInput.supplements
            .map((s) => (s.label ? `- ${s.label}: ${s.value}` : `- ${s.value}`))
            .join("\n")
        : "（補足情報なし）";

    return `ユーザーの初期入力:
- 会議の目的: 「${initialInput.theme}」を${initialInput.verb}

補足情報:
${supplementsText}

この情報を元に、会議資料に必要な情報を引き出す質問を生成してください。`;
  }
  return `これまでの対話:
${JSON.stringify(messages, null, 2)}

この対話を踏まえて：
1. 十分な情報が集まっていれば ready: true を返す
2. まだ必要な情報があれば、追加の質問を生成する`;
}

function cleanJsonResponse(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export type QuestionStreamCallbacks = {
  onThinkingStart: () => void;
  onThinking: (text: string) => void;
  onBlockStop: () => void;
  onProgress: () => void;
};

export async function streamQuestion(
  type: MeetingType,
  initialInput: InitialInputData | undefined,
  messages: unknown[] | undefined,
  callbacks: QuestionStreamCallbacks
): Promise<unknown> {
  const systemPrompt = getQuestionSystemPrompt(type) + JSON_INSTRUCTION;
  const userPrompt = buildUserPrompt(initialInput, messages);
  const config = MODEL_CONFIG.question;

  const messageStream = anthropic.messages.stream({
    model: config.model,
    max_tokens: config.maxTokens,
    thinking: { type: "enabled" as const, budget_tokens: config.thinkingBudget },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  let fullText = "";

  for await (const event of messageStream) {
    if (event.type === "content_block_start" && event.content_block.type === "thinking") {
      callbacks.onThinkingStart();
    } else if (event.type === "content_block_delta") {
      if (event.delta.type === "thinking_delta") {
        callbacks.onThinking(event.delta.thinking);
      } else if (event.delta.type === "text_delta") {
        fullText += event.delta.text;
        callbacks.onProgress();
      }
    } else if (event.type === "content_block_stop") {
      callbacks.onBlockStop();
    }
  }

  return JSON.parse(cleanJsonResponse(fullText));
}

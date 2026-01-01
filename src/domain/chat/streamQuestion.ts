import { anthropic, MODEL_ID } from "@/lib/anthropic";
import { getQuestionSystemPrompt } from "@/lib/prompts";
import type { HorensoType } from "@/types";

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

type InitialInput = { topic: string; recipient: string; detail: string };

function buildUserPrompt(initialInput?: InitialInput, messages?: unknown[]): string {
  if (initialInput) {
    return `ユーザーの初期入力:
- 何を伝えたい: ${initialInput.topic}
- 誰に: ${initialInput.recipient}
- 状況・背景: ${initialInput.detail}

この情報を元に、より詳しく整理するための質問を生成してください。`;
  }
  return `これまでの対話:
${JSON.stringify(messages, null, 2)}

この対話を踏まえて：
1. 十分な情報が集まっていれば ready: true を返す
2. まだ必要な情報があれば、追加の質問を生成する`;
}

function cleanJsonResponse(text: string): string {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

export type QuestionStreamCallbacks = {
  onThinkingStart: () => void;
  onThinking: (text: string) => void;
  onBlockStop: () => void;
  onProgress: () => void;
};

export async function streamQuestion(
  type: HorensoType,
  initialInput: InitialInput | undefined,
  messages: unknown[] | undefined,
  callbacks: QuestionStreamCallbacks
): Promise<unknown> {
  const systemPrompt = getQuestionSystemPrompt(type) + JSON_INSTRUCTION;
  const userPrompt = buildUserPrompt(initialInput, messages);
  const useThinking = !!initialInput;

  const messageStream = anthropic.messages.stream({
    model: MODEL_ID,
    max_tokens: 16000,
    ...(useThinking && { thinking: { type: "enabled" as const, budget_tokens: 5000 } }),
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

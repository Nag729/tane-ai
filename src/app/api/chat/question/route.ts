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

export async function POST(request: Request) {
  const body = await request.json();
  const { type, initialInput, messages } = body as {
    type: HorensoType;
    initialInput?: { topic: string; recipient: string; detail: string };
    messages?: unknown[];
  };

  const systemPrompt = getQuestionSystemPrompt(type) + JSON_INSTRUCTION;

  let userPrompt: string;
  if (initialInput) {
    userPrompt = `ユーザーの初期入力:
- 何を伝えたい: ${initialInput.topic}
- 誰に: ${initialInput.recipient}
- 状況・背景: ${initialInput.detail}

この情報を元に、より詳しく整理するための質問を生成してください。`;
  } else {
    userPrompt = `これまでの対話:
${JSON.stringify(messages, null, 2)}

この対話を踏まえて：
1. 十分な情報が集まっていれば ready: true を返す
2. まだ必要な情報があれば、追加の質問を生成する`;
  }

  const useThinking = !!initialInput; // 初回のみ Extended Thinking

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropic.messages.stream({
          model: MODEL_ID,
          max_tokens: 16000,
          ...(useThinking && {
            thinking: {
              type: "enabled" as const,
              budget_tokens: 5000,
            },
          }),
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        // ストリーミング中のテキストを収集
        let fullText = "";

        // ストリームを読み取り
        for await (const event of messageStream) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "thinking") {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "thinking_start" })}\n\n`)
              );
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "thinking_delta") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "thinking", text: event.delta.thinking })}\n\n`
                )
              );
            } else if (event.delta.type === "text_delta") {
              fullText += event.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "progress" })}\n\n`)
              );
            }
          } else if (event.type === "content_block_stop") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "block_stop" })}\n\n`)
            );
          }
        }

        // JSON をクリーンアップしてパース
        const cleaned = fullText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const result = JSON.parse(cleaned);

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "complete", data: result })}\n\n`)
        );
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: String(error) })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

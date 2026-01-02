import { streamQuestion } from "@/domain/chat/streamQuestion";
import type { MeetingType } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, initialInput, messages } = body as {
    type: MeetingType;
    initialInput?: { topic: string; participant: string; detail: string };
    messages?: unknown[];
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const result = await streamQuestion(type, initialInput, messages, {
          onThinkingStart: () => send({ type: "thinking_start" }),
          onThinking: (text) => send({ type: "thinking", text }),
          onBlockStop: () => send({ type: "block_stop" }),
          onProgress: () => send({ type: "progress" }),
        });

        send({ type: "complete", data: result });
        controller.close();
      } catch (error) {
        send({ type: "error", error: String(error) });
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

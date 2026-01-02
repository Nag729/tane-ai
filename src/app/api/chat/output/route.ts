import { streamOutput } from "@/domain/chat/streamOutput";
import type { MeetingType, ChatMessage } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, messages, previousOutput, feedback } = body as {
    type: MeetingType;
    messages: ChatMessage[];
    previousOutput?: { content: string };
    feedback?: string;
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        await streamOutput(
          { type, messages, previousOutput, feedback },
          {
            onThinkingStart: () => send({ type: "thinking_start" }),
            onThinking: (text) => send({ type: "thinking", text }),
            onTextStart: () => send({ type: "text_start" }),
            onText: (text) => send({ type: "text", text }),
            onBlockStop: () => send({ type: "block_stop" }),
          }
        );

        send({ type: "done" });
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

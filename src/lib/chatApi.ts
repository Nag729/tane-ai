import { readSSEStream, readTextSSEStream, SSECallbacks } from "@/lib/sse";
import type { HorensoType, ChatMessage } from "@/types";

export type QuestionResponse = {
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

type InitialInput = {
  topic: string;
  recipient: string;
  detail: string;
};

/** 初回質問を生成 */
export async function fetchInitialQuestion(
  type: HorensoType,
  initialInput: InitialInput,
  callbacks?: SSECallbacks
): Promise<QuestionResponse> {
  const response = await fetch("/api/chat/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, initialInput }),
  });
  return readSSEStream<QuestionResponse>(response, callbacks);
}

/** 次の質問を生成 */
export async function fetchNextQuestion(
  type: HorensoType,
  messages: ChatMessage[]
): Promise<QuestionResponse> {
  const response = await fetch("/api/chat/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, messages }),
  });
  return readSSEStream<QuestionResponse>(response);
}

/** 最終出力を生成 */
export async function fetchOutput(
  type: HorensoType,
  messages: ChatMessage[],
  callbacks?: SSECallbacks & { onTextAccumulated?: (text: string) => void }
): Promise<string> {
  const response = await fetch("/api/chat/output", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, messages }),
  });
  return readTextSSEStream(response, callbacks);
}

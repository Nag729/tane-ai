/** SSE イベントの型 */
export type SSEEventType =
  | "progress"
  | "text"
  | "thinking_start"
  | "thinking"
  | "block_stop"
  | "complete"
  | "done"
  | "error";

export type SSEEventData = {
  type: SSEEventType;
  text?: string;
  data?: unknown;
  error?: string;
};

/** SSE ストリームのコールバック */
export type SSECallbacks = {
  onProgress?: () => void;
  onText?: (text: string) => void;
  onThinkingStart?: () => void;
  onThinking?: (text: string) => void;
  onBlockStop?: () => void;
};

/** SSE イベントを処理するハンドラを作成 */
function createEventHandlers(callbacks?: SSECallbacks) {
  return {
    progress: () => callbacks?.onProgress?.(),
    text: (data: SSEEventData) => callbacks?.onText?.(data.text ?? ""),
    thinking_start: () => callbacks?.onThinkingStart?.(),
    thinking: (data: SSEEventData) => callbacks?.onThinking?.(data.text ?? ""),
    block_stop: () => callbacks?.onBlockStop?.(),
  };
}

/** SSE バッファを処理してイベントを抽出 */
function parseSSELines(buffer: string): { events: SSEEventData[]; remaining: string } {
  const lines = buffer.split("\n\n");
  const remaining = lines.pop() || "";
  const events: SSEEventData[] = [];

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      events.push(JSON.parse(line.slice(6)) as SSEEventData);
    }
  }

  return { events, remaining };
}

/** SSE ストリームを読み取る（complete イベントで結果を返す） */
export async function readSSEStream<T>(response: Response, callbacks?: SSECallbacks): Promise<T> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  const handlers = createEventHandlers(callbacks);
  let buffer = "";
  let result: T | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remaining } = parseSSELines(buffer);
    buffer = remaining;

    for (const data of events) {
      if (data.type === "error") throw new Error(data.error);
      if (data.type === "complete") result = data.data as T;
      handlers[data.type as keyof typeof handlers]?.(data);
    }
  }

  if (result === undefined) throw new Error("No result received");
  return result;
}

/** text イベントを処理するハンドラを作成 */
function createTextEventHandler(
  callbacks?: SSECallbacks & { onTextAccumulated?: (fullText: string) => void }
) {
  let fullText = "";

  const handlers: Record<string, (data: SSEEventData) => void> = {
    thinking_start: () => callbacks?.onThinkingStart?.(),
    thinking: (data) => callbacks?.onThinking?.(data.text ?? ""),
    block_stop: () => callbacks?.onBlockStop?.(),
    text: (data) => {
      fullText += data.text ?? "";
      callbacks?.onTextAccumulated?.(fullText);
    },
  };

  return {
    process: (data: SSEEventData) => handlers[data.type]?.(data),
    getFullText: () => fullText,
  };
}

/** SSE ストリームを読み取る（text を蓄積して返す） */
export async function readTextSSEStream(
  response: Response,
  callbacks?: SSECallbacks & { onTextAccumulated?: (fullText: string) => void }
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  const handler = createTextEventHandler(callbacks);
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remaining } = parseSSELines(buffer);
    buffer = remaining;

    for (const data of events) {
      if (data.type === "error") throw new Error(data.error);
      handler.process(data);
    }
  }

  return handler.getFullText();
}

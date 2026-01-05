import { describe, it, expect, vi } from "vitest";
import { readSSEStream, readTextSSEStream } from "./sse";

function createMockResponse(chunks: string[]): Response {
  let index = 0;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });

  return { body: stream } as Response;
}

describe("readSSEStream", () => {
  // Given: complete イベントを含むレスポンス
  // When: readSSEStream を呼び出す
  // Then: complete の data が返される
  it("should return data from complete event", async () => {
    const response = createMockResponse(['data: {"type":"complete","data":{"value":"test"}}\n\n']);
    const result = await readSSEStream<{ value: string }>(response);
    expect(result).toEqual({ value: "test" });
  });

  // Given: thinking イベントを含むレスポンス
  // When: readSSEStream を呼び出す
  // Then: onThinking コールバックが呼ばれる
  it("should call thinking callback", async () => {
    const onThinking = vi.fn();

    const response = createMockResponse([
      'data: {"type":"thinking","text":"thinking..."}\n\n',
      'data: {"type":"complete","data":"done"}\n\n',
    ]);

    await readSSEStream(response, { onThinking });

    expect(onThinking).toHaveBeenCalledWith("thinking...");
  });

  // Given: error イベントを含むレスポンス
  // When: readSSEStream を呼び出す
  // Then: エラーがスローされる
  it("should throw on error event", async () => {
    const response = createMockResponse(['data: {"type":"error","error":"API error"}\n\n']);
    await expect(readSSEStream(response)).rejects.toThrow("API error");
  });

  // Given: complete イベントがないレスポンス
  // When: readSSEStream を呼び出す
  // Then: No result received エラーがスローされる
  it("should throw when no complete event", async () => {
    const response = createMockResponse(['data: {"type":"progress"}\n\n']);
    await expect(readSSEStream(response)).rejects.toThrow("No result received");
  });

  // Given: body がないレスポンス
  // When: readSSEStream を呼び出す
  // Then: No response body エラーがスローされる
  it("should throw when no response body", async () => {
    const response = { body: null } as Response;
    await expect(readSSEStream(response)).rejects.toThrow("No response body");
  });
});

describe("readTextSSEStream", () => {
  // Given: text イベントを含むレスポンス
  // When: readTextSSEStream を呼び出す
  // Then: 蓄積されたテキストが返される
  it("should accumulate text from text events", async () => {
    const response = createMockResponse([
      'data: {"type":"text","text":"Hello "}\n\n',
      'data: {"type":"text","text":"World"}\n\n',
    ]);
    const result = await readTextSSEStream(response);
    expect(result).toBe("Hello World");
  });

  // Given: onTextAccumulated コールバックがある
  // When: text イベントを受信
  // Then: コールバックが蓄積テキストで呼ばれる
  it("should call onTextAccumulated with accumulated text", async () => {
    const onTextAccumulated = vi.fn();
    const response = createMockResponse([
      'data: {"type":"text","text":"Hello "}\n\n',
      'data: {"type":"text","text":"World"}\n\n',
    ]);

    await readTextSSEStream(response, { onTextAccumulated });

    expect(onTextAccumulated).toHaveBeenCalledWith("Hello ");
    expect(onTextAccumulated).toHaveBeenCalledWith("Hello World");
  });

  // Given: error イベントを含むレスポンス
  // When: readTextSSEStream を呼び出す
  // Then: エラーがスローされる
  it("should throw on error event", async () => {
    const response = createMockResponse(['data: {"type":"error","error":"Stream error"}\n\n']);
    await expect(readTextSSEStream(response)).rejects.toThrow("Stream error");
  });
});

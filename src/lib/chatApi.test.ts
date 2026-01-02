import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchInitialQuestion, fetchNextQuestion, fetchOutput, QuestionResponse } from "./chatApi";

// SSE のモック
vi.mock("@/lib/sse", () => ({
  readSSEStream: vi.fn(),
  readTextSSEStream: vi.fn(),
}));

import { readSSEStream, readTextSSEStream } from "@/lib/sse";

const mockReadSSEStream = vi.mocked(readSSEStream);
const mockReadTextSSEStream = vi.mocked(readTextSSEStream);

describe("chatApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const mockQuestionResponse: QuestionResponse = {
    intro: "テスト質問",
    questions: [
      {
        id: "q-1",
        content: "質問内容",
        options: [{ id: "opt-1", label: "選択肢" }],
        multiSelect: false,
      },
    ],
    ready: false,
  };

  describe("fetchInitialQuestion", () => {
    // Given: 初期入力がある
    // When: fetchInitialQuestion を呼び出す
    // Then: 正しいエンドポイントに POST される
    it("should call correct endpoint with initial input", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ body: {} });
      global.fetch = mockFetch;
      mockReadSSEStream.mockResolvedValue(mockQuestionResponse);

      const initialInput = { topic: "テスト", participant: "テックリード", detail: "詳細" };
      await fetchInitialQuestion("decision", initialInput);

      expect(mockFetch).toHaveBeenCalledWith("/api/chat/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "decision", initialInput }),
      });
    });

    // Given: SSE レスポンスがある
    // When: fetchInitialQuestion を呼び出す
    // Then: QuestionResponse が返される
    it("should return question response", async () => {
      global.fetch = vi.fn().mockResolvedValue({ body: {} });
      mockReadSSEStream.mockResolvedValue(mockQuestionResponse);

      const result = await fetchInitialQuestion("decision", {
        topic: "",
        participant: "",
        detail: "",
      });

      expect(result).toEqual(mockQuestionResponse);
    });
  });

  describe("fetchNextQuestion", () => {
    // Given: メッセージ履歴がある
    // When: fetchNextQuestion を呼び出す
    // Then: 正しいエンドポイントに POST される
    it("should call correct endpoint with messages", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ body: {} });
      global.fetch = mockFetch;
      mockReadSSEStream.mockResolvedValue(mockQuestionResponse);

      const messages = [
        { role: "ai" as const, message: { id: "1", intro: "test", questions: [] } },
      ];
      await fetchNextQuestion("share", messages);

      expect(mockFetch).toHaveBeenCalledWith("/api/chat/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "share", messages }),
      });
    });
  });

  describe("fetchOutput", () => {
    // Given: メッセージ履歴がある
    // When: fetchOutput を呼び出す
    // Then: 正しいエンドポイントに POST される
    it("should call correct endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ body: {} });
      global.fetch = mockFetch;
      mockReadTextSSEStream.mockResolvedValue("出力テキスト");

      const messages = [
        { role: "ai" as const, message: { id: "1", intro: "test", questions: [] } },
      ];
      await fetchOutput("discussion", messages);

      expect(mockFetch).toHaveBeenCalledWith("/api/chat/output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "discussion", messages }),
      });
    });

    // Given: SSE レスポンスがある
    // When: fetchOutput を呼び出す
    // Then: テキストが返される
    it("should return output text", async () => {
      global.fetch = vi.fn().mockResolvedValue({ body: {} });
      mockReadTextSSEStream.mockResolvedValue("生成された出力");

      const result = await fetchOutput("decision", []);

      expect(result).toBe("生成された出力");
    });
  });
});

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useChat, loadChatData, clearChatData } from "./useChat";

// sessionStorage のモック
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

// SSE イベントの型
type SSEEvent = { type: string; data?: unknown; error?: string };

// SSE レスポンスを生成するヘルパー
function createSSEResponse(events: SSEEvent[]): string {
  return events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
}

// fetch のモック用ヘルパー
function mockFetchSSE(body: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });

  return vi.fn().mockResolvedValue({
    ok: true,
    body: stream,
  });
}

describe("loadChatData", () => {
  beforeEach(() => {
    mockSessionStorage.clear();
  });

  // Given: sessionStorage にデータがない
  // When: loadChatData を呼ぶ
  // Then: null を返す
  it("should return null when no data exists", () => {
    const result = loadChatData();
    expect(result).toBeNull();
  });

  // Given: sessionStorage に有効なデータがある
  // When: loadChatData を呼ぶ
  // Then: パースされたデータを返す
  it("should return parsed data when valid data exists", () => {
    const chatData = {
      type: "decision",
      messages: [],
      output: { content: "テスト出力" },
    };
    mockSessionStorage.setItem("tane-chat-data", JSON.stringify(chatData));

    const result = loadChatData();
    expect(result).toEqual(chatData);
  });

  // Given: sessionStorage に不正な JSON がある
  // When: loadChatData を呼ぶ
  // Then: null を返す
  it("should return null when invalid JSON exists", () => {
    mockSessionStorage.setItem("tane-chat-data", "invalid json");

    const result = loadChatData();
    expect(result).toBeNull();
  });
});

describe("clearChatData", () => {
  beforeEach(() => {
    mockSessionStorage.clear();
  });

  // Given: sessionStorage にデータがある
  // When: clearChatData を呼ぶ
  // Then: データが削除される
  it("should remove data from sessionStorage", () => {
    mockSessionStorage.setItem("tane-chat-data", '{"type":"decision"}');

    clearChatData();

    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("tane-chat-data");
  });
});

describe("useChat", () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Given: useChat フックを初期化
  // When: レンダリングする
  // Then: 初期状態が正しい
  it("should have correct initial state", () => {
    const { result } = renderHook(() => useChat({ type: "decision", onComplete: mockOnComplete }));

    expect(result.current.phase).toBe("idle");
    expect(result.current.messages).toEqual([]);
    expect(result.current.currentAIMessage).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasQuestions).toBe(false);
    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // Given: 初期入力データがある
  // When: submitInitialInput を呼ぶ
  // Then: API を呼び出し、メッセージを更新する
  it("should submit initial input and update messages", async () => {
    const mockResponse = createSSEResponse([
      { type: "progress" },
      {
        type: "complete",
        data: {
          intro: "なるほど！",
          questions: [
            {
              id: "q1",
              content: "詳細を教えて",
              options: [{ id: "opt1", label: "選択肢1" }],
              multiSelect: false,
            },
          ],
          ready: false,
        },
      },
    ]);

    global.fetch = mockFetchSSE(mockResponse);

    const { result } = renderHook(() => useChat({ type: "decision", onComplete: mockOnComplete }));

    await act(async () => {
      await result.current.submitInitialInput({
        topic: "テスト",
        participant: "テスト相手",
        detail: "テスト詳細",
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("ai");
    expect(result.current.currentAIMessage?.intro).toBe("なるほど！");
    expect(result.current.hasQuestions).toBe(true);
  });

  // Given: 質問への回答がある
  // When: submitAnswer を呼ぶ
  // Then: メッセージが追加される
  it("should submit answer and add messages", async () => {
    const initialResponse = createSSEResponse([
      {
        type: "complete",
        data: {
          intro: "最初の質問",
          questions: [
            {
              id: "q1",
              content: "質問1",
              options: [{ id: "opt1", label: "選択肢1" }],
              multiSelect: false,
            },
          ],
          ready: false,
        },
      },
    ]);

    const followUpResponse = createSSEResponse([
      {
        type: "complete",
        data: {
          intro: "十分な情報が集まりました",
          questions: [],
          ready: true,
        },
      },
    ]);

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      const body = callCount === 1 ? initialResponse : followUpResponse;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(body));
          controller.close();
        },
      });
      return Promise.resolve({ ok: true, body: stream });
    });

    const { result } = renderHook(() => useChat({ type: "discussion", onComplete: mockOnComplete }));

    // 初期入力
    await act(async () => {
      await result.current.submitInitialInput({
        topic: "議論内容",
        participant: "参加者",
        detail: "詳細",
      });
    });

    await waitFor(() => {
      expect(result.current.hasQuestions).toBe(true);
    });

    // 回答を送信
    await act(async () => {
      await result.current.submitAnswer([{ questionId: "q1", selectedOptionIds: ["opt1"] }]);
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.messages).toHaveLength(3); // AI, User, AI
  });

  // Given: ready 状態になっている
  // When: completeChat を呼ぶ
  // Then: sessionStorage に保存され、onComplete が呼ばれる
  it("should complete chat and save to storage", async () => {
    const questionResponse = createSSEResponse([
      {
        type: "complete",
        data: {
          intro: "OK",
          questions: [],
          ready: true,
        },
      },
    ]);

    global.fetch = mockFetchSSE(questionResponse);

    const { result } = renderHook(() => useChat({ type: "decision", onComplete: mockOnComplete }));

    // 初期入力（ready: true を返す）
    await act(async () => {
      await result.current.submitInitialInput({
        topic: "テスト",
        participant: "参加者",
        detail: "詳細",
      });
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    // チャット完了（ストレージ保存 + 遷移）
    act(() => {
      result.current.completeChat();
    });

    // sessionStorage に保存されている
    expect(mockSessionStorage.setItem).toHaveBeenCalled();
    // onComplete が呼ばれる
    expect(mockOnComplete).toHaveBeenCalled();
  });

  // Given: API がエラーを返す
  // When: submitInitialInput を呼ぶ
  // Then: エラー状態が設定される
  it("should handle API errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useChat({ type: "decision", onComplete: mockOnComplete }));

    await act(async () => {
      await result.current.submitInitialInput({
        topic: "テスト",
        participant: "参加者",
        detail: "詳細",
      });
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.isLoading).toBe(false);
  });

  // Given: SSE でエラーイベントが来る
  // When: ストリームを処理する
  // Then: エラー状態が設定される
  it("should handle SSE error events", async () => {
    const errorResponse = createSSEResponse([{ type: "error", error: "API エラー" }]);

    global.fetch = mockFetchSSE(errorResponse);

    const { result } = renderHook(() => useChat({ type: "decision", onComplete: mockOnComplete }));

    await act(async () => {
      await result.current.submitInitialInput({
        topic: "テスト",
        participant: "参加者",
        detail: "詳細",
      });
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });
});

describe("useChat.getAnswerDisplay", () => {
  // Given: ユーザーメッセージがある
  // When: getAnswerDisplay を呼ぶ
  // Then: 回答のラベルが返される
  it("should return answer display text", async () => {
    const questionResponse = createSSEResponse([
      {
        type: "complete",
        data: {
          intro: "質問",
          questions: [
            {
              id: "q1",
              content: "どれ？",
              options: [
                { id: "opt1", label: "選択肢A" },
                { id: "opt2", label: "選択肢B" },
              ],
              multiSelect: false,
            },
          ],
          ready: false,
        },
      },
    ]);

    const followUpResponse = createSSEResponse([
      {
        type: "complete",
        data: { intro: "OK", questions: [], ready: true },
      },
    ]);

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      const body = callCount === 1 ? questionResponse : followUpResponse;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(body));
          controller.close();
        },
      });
      return Promise.resolve({ ok: true, body: stream });
    });

    const { result } = renderHook(() => useChat({ type: "decision", onComplete: vi.fn() }));

    await act(async () => {
      await result.current.submitInitialInput({
        topic: "t",
        participant: "p",
        detail: "d",
      });
    });

    await waitFor(() => {
      expect(result.current.hasQuestions).toBe(true);
    });

    await act(async () => {
      await result.current.submitAnswer([{ questionId: "q1", selectedOptionIds: ["opt1"] }]);
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(1);
    });

    const userMessage = result.current.messages.find((m) => m.role === "user");
    if (userMessage) {
      const display = result.current.getAnswerDisplay(userMessage);
      expect(display).toContain("選択肢A");
    }
  });
});

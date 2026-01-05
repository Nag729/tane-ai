import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useResult } from "./useResult";

// next/navigation のモック
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

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
    _setStore: (data: Record<string, string>) => {
      store = data;
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

// SSE イベントの型
type SSEEvent = { type: string; text?: string; error?: string };

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

describe("useResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Given: type が null
  // When: useResult を呼ぶ
  // Then: isValidParams が false でリダイレクト
  it("should redirect when type is null", async () => {
    renderHook(() => useResult({ type: null }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  // Given: 有効な type がある
  // When: useResult を初期化
  // Then: 初期状態が正しい
  it("should have correct initial state with valid type", () => {
    const { result } = renderHook(() => useResult({ type: "decision" }));

    expect(result.current.isValidParams).toBe(true);
    expect(result.current.phase).toBe("generating");
    expect(result.current.output).toBeNull();
    expect(result.current.isGenerating).toBe(true);
    expect(result.current.isReviewing).toBe(false);
  });

  // Given: sessionStorage に出力データがある
  // When: useResult を初期化
  // Then: phase が complete になる
  it("should load existing output from storage", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
      output: { content: "保存された出力" },
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    expect(result.current.output?.content).toBe("保存された出力");
    expect(result.current.isGenerating).toBe(false);
  });

  // Given: sessionStorage にメッセージがない
  // When: useResult を初期化
  // Then: トップページにリダイレクト
  it("should redirect when no messages in storage", async () => {
    mockSessionStorage._setStore({
      "tane-chat-data": JSON.stringify({ type: "decision", messages: [] }),
    });

    renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  // Given: メッセージがあり出力がない
  // When: useResult を初期化
  // Then: 自動で出力生成が始まる
  it("should auto-generate output when messages exist but no output", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    const outputResponse = createSSEResponse([
      { type: "text", text: "生成された" },
      { type: "text", text: "出力です" },
      { type: "done" },
    ]);

    global.fetch = mockFetchSSE(outputResponse);

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    expect(result.current.output?.content).toBe("生成された出力です");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/chat/output",
      expect.objectContaining({ method: "POST" })
    );
  });

  // Given: 出力が完了している
  // When: requestReview を呼ぶ
  // Then: AIレビューが実行される
  it("should request AI review", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
      output: { content: "既存の出力" },
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    const reviewResponse = createSSEResponse([
      { type: "text", text: "レビュー" },
      { type: "text", text: "結果" },
      { type: "done" },
    ]);

    global.fetch = mockFetchSSE(reviewResponse);

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    await act(async () => {
      await result.current.requestReview();
    });

    await waitFor(() => {
      expect(result.current.aiFeedback).toBe("レビュー結果");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/chat/feedback-review",
      expect.objectContaining({ method: "POST" })
    );
  });

  // Given: AIフィードバックがある
  // When: applyFeedback を呼ぶ
  // Then: フィードバックを反映して再生成
  it("should apply feedback and regenerate", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
      output: { content: "既存の出力" },
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    const reviewResponse = createSSEResponse([
      { type: "text", text: "改善点があります" },
      { type: "done" },
    ]);

    const regenerateResponse = createSSEResponse([
      { type: "text", text: "改善された出力" },
      { type: "done" },
    ]);

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      const body = callCount === 1 ? reviewResponse : regenerateResponse;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(body));
          controller.close();
        },
      });
      return Promise.resolve({ ok: true, body: stream });
    });

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    // レビュー実行
    await act(async () => {
      await result.current.requestReview();
    });

    await waitFor(() => {
      expect(result.current.aiFeedback).toBeTruthy();
    });

    // フィードバック適用
    await act(async () => {
      await result.current.applyFeedback();
    });

    await waitFor(() => {
      expect(result.current.output?.content).toBe("改善された出力");
    });
  });

  // Given: 結果ページにいる
  // When: startOver を呼ぶ
  // Then: ストレージクリア + トップへ遷移
  it("should clear storage and navigate to home on startOver", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
      output: { content: "出力" },
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    act(() => {
      result.current.startOver();
    });

    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("tane-chat-data");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  // Given: API がエラーを返す
  // When: 出力生成中にエラー
  // Then: phase が complete に戻る
  it("should handle generation errors gracefully", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    expect(result.current.output).toBeNull();
  });

  // Given: レビュー中
  // When: isReviewing をチェック
  // Then: true を返す
  it("should track reviewing phase correctly", async () => {
    const chatData = {
      type: "decision",
      messages: [{ role: "ai", message: { id: "m1", intro: "テスト", questions: [] } }],
      output: { content: "出力" },
    };
    mockSessionStorage._setStore({ "tane-chat-data": JSON.stringify(chatData) });

    // レビューが完了しないようにする
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"type":"text","text":"レビュー中..."}\n\n'));
        // close しない = ストリーミング中
      },
    });
    global.fetch = vi.fn().mockResolvedValue({ ok: true, body: stream });

    const { result } = renderHook(() => useResult({ type: "decision" }));

    await waitFor(() => {
      expect(result.current.phase).toBe("complete");
    });

    act(() => {
      result.current.requestReview();
    });

    await waitFor(() => {
      expect(result.current.phase).toBe("reviewing");
      expect(result.current.isReviewing).toBe(true);
    });
  });
});

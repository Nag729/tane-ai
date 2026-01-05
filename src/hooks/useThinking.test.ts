import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useThinking } from "./useThinking";

describe("useThinking", () => {
  // Given: 初期状態
  // When: フックを呼び出す
  // Then: thinkingContent は空
  it("should have empty initial state", () => {
    const { result } = renderHook(() => useThinking());
    expect(result.current.thinkingContent).toBe("");
  });

  // Given: createThinkingCallbacks を呼び出す
  // When: onThinking を複数回実行
  // Then: thinkingContent にテキストが蓄積される
  it("should accumulate thinking content", () => {
    const { result } = renderHook(() => useThinking());
    const callbacks = result.current.createThinkingCallbacks();

    act(() => {
      callbacks.onThinking?.("Hello ");
      callbacks.onThinking?.("World");
    });

    expect(result.current.thinkingContent).toBe("Hello World");
  });

  // Given: thinkingContent がある
  // When: resetThinking を呼び出す
  // Then: thinkingContent が空になる
  it("should reset thinking content", () => {
    const { result } = renderHook(() => useThinking());
    const callbacks = result.current.createThinkingCallbacks();

    act(() => {
      callbacks.onThinking?.("Some text");
    });
    expect(result.current.thinkingContent).toBe("Some text");

    act(() => {
      result.current.resetThinking();
    });
    expect(result.current.thinkingContent).toBe("");
  });
});

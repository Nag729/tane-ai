import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useThinking } from "./useThinking";

describe("useThinking", () => {
  // Given: 初期状態
  // When: フックを呼び出す
  // Then: isThinking は false、thinkingContent は空
  it("should have correct initial state", () => {
    const { result } = renderHook(() => useThinking());
    expect(result.current.isThinking).toBe(false);
    expect(result.current.thinkingContent).toBe("");
  });

  // Given: createThinkingCallbacks を呼び出す
  // When: onThinkingStart を実行
  // Then: isThinking が true になる
  it("should set isThinking to true on onThinkingStart", () => {
    const { result } = renderHook(() => useThinking());
    const callbacks = result.current.createThinkingCallbacks();

    act(() => {
      callbacks.onThinkingStart?.();
    });

    expect(result.current.isThinking).toBe(true);
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

  // Given: createThinkingCallbacks を呼び出す
  // When: onBlockStop を実行
  // Then: isThinking が false になる
  it("should set isThinking to false on onBlockStop", () => {
    const { result } = renderHook(() => useThinking());
    const callbacks = result.current.createThinkingCallbacks();

    act(() => {
      callbacks.onThinkingStart?.();
      callbacks.onBlockStop?.();
    });

    expect(result.current.isThinking).toBe(false);
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

  // Given: isThinking が true
  // When: stopThinking を呼び出す
  // Then: isThinking が false になる
  it("should stop thinking", () => {
    const { result } = renderHook(() => useThinking());
    const callbacks = result.current.createThinkingCallbacks();

    act(() => {
      callbacks.onThinkingStart?.();
    });
    expect(result.current.isThinking).toBe(true);

    act(() => {
      result.current.stopThinking();
    });
    expect(result.current.isThinking).toBe(false);
  });
});

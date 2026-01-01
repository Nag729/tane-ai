"use client";

import { useState, useCallback } from "react";
import type { SSECallbacks } from "@/lib/sse";

export function useThinking() {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingContent, setThinkingContent] = useState("");

  const resetThinking = useCallback(() => {
    setThinkingContent("");
  }, []);

  const createThinkingCallbacks = useCallback((): SSECallbacks => {
    let thinkingText = "";
    return {
      onThinkingStart: () => setIsThinking(true),
      onThinking: (text: string) => {
        thinkingText += text;
        setThinkingContent(thinkingText);
      },
      onBlockStop: () => setIsThinking(false),
    };
  }, []);

  const stopThinking = useCallback(() => {
    setIsThinking(false);
  }, []);

  return {
    isThinking,
    thinkingContent,
    resetThinking,
    createThinkingCallbacks,
    stopThinking,
  };
}

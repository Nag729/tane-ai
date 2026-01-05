"use client";

import { useState, useCallback } from "react";
import type { SSECallbacks } from "@/lib/sse";

export function useThinking() {
  const [thinkingContent, setThinkingContent] = useState("");

  const resetThinking = useCallback(() => {
    setThinkingContent("");
  }, []);

  const createThinkingCallbacks = useCallback((): SSECallbacks => {
    let thinkingText = "";
    return {
      onThinking: (text: string) => {
        thinkingText += text;
        setThinkingContent(thinkingText);
      },
    };
  }, []);

  return {
    thinkingContent,
    resetThinking,
    createThinkingCallbacks,
  };
}

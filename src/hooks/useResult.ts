"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadChatData, clearChatData, saveChatData } from "@/lib/chatStorage";
import { useThinking } from "./useThinking";
import { readTextSSEStream } from "@/lib/sse";
import type { MeetingType, StructuredOutput, ChatMessage } from "@/types";

/**
 * 結果ページのフェーズ
 */
export type ResultPhase =
  | "generating" // 初回出力生成中
  | "complete" // 出力完了、表示中
  | "regenerating" // 再生成中
  | "reviewing"; // AIレビュー中

type UseResultOptions = {
  type: MeetingType | null;
};

// eslint-disable-next-line max-lines-per-function
export function useResult({ type }: UseResultOptions) {
  const router = useRouter();
  const isValidParams = !!type;

  // 基本状態
  const [phase, setPhase] = useState<ResultPhase>("generating");
  const [output, setOutput] = useState<StructuredOutput | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const thinking = useThinking();
  const generationStarted = useRef(false);

  // AIレビュー用の状態
  const [aiFeedback, setAiFeedback] = useState("");
  const [streamingFeedback, setStreamingFeedback] = useState("");
  const reviewThinking = useThinking();

  // データをロード（マウント時の初期化）
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const chatData = loadChatData();
    if (chatData) {
      setMessages(chatData.messages);
      if (chatData.output) {
        setOutput(chatData.output);
        setPhase("complete");
      }
    }
    setIsLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // パラメータチェック
  useEffect(() => {
    if (!isValidParams) router.replace("/");
  }, [isValidParams, router]);

  // データがない場合はトップへ
  useEffect(() => {
    if (isLoaded && messages.length === 0) router.replace("/");
  }, [isLoaded, messages.length, router]);

  /**
   * 出力を生成する共通ロジック
   */
  const generateOutput = useCallback(
    async (feedback?: string, previousOutput?: StructuredOutput) => {
      if (!type) return;

      setPhase(feedback ? "regenerating" : "generating");
      setStreamingContent("");
      thinking.resetThinking();
      // 再生成時はAIフィードバックをクリア
      if (feedback) {
        setAiFeedback("");
        setStreamingFeedback("");
      }

      try {
        const response = await fetch("/api/chat/output", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            messages,
            ...(feedback && { previousOutput, feedback }),
          }),
        });

        const fullText = await readTextSSEStream(response, {
          ...thinking.createThinkingCallbacks(),
          onTextAccumulated: setStreamingContent,
        });

        const newOutput = { content: fullText };
        setOutput(newOutput);
        setStreamingContent("");
        setPhase("complete");

        saveChatData({ type, messages, output: newOutput });
      } catch (error) {
        console.error("Failed to generate output:", error);
        setPhase("complete");
      }
    },
    [type, messages, thinking]
  );

  // 初回出力生成（データロード完了後に自動開始）
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isLoaded && messages.length > 0 && !output && !generationStarted.current) {
      generationStarted.current = true;
      generateOutput();
    }
  }, [isLoaded, messages.length, output, generateOutput]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /**
   * AIレビューを実行
   */
  const requestReview = useCallback(async () => {
    if (!type || !output) return;

    setPhase("reviewing");
    setStreamingFeedback("");
    setAiFeedback("");
    reviewThinking.resetThinking();

    try {
      const response = await fetch("/api/chat/feedback-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, messages, output }),
      });

      const fullText = await readTextSSEStream(response, {
        ...reviewThinking.createThinkingCallbacks(),
        onTextAccumulated: setStreamingFeedback,
      });

      setAiFeedback(fullText);
      setStreamingFeedback("");
      setPhase("complete");
    } catch (error) {
      console.error("Failed to get AI feedback:", error);
      setPhase("complete");
    }
  }, [type, messages, output, reviewThinking]);

  /**
   * AIフィードバックを反映して再生成
   */
  const applyFeedback = useCallback(async () => {
    if (output && aiFeedback) {
      await generateOutput(aiFeedback, output);
    }
  }, [output, aiFeedback, generateOutput]);

  /**
   * 最初からやり直す
   */
  const startOver = useCallback(() => {
    clearChatData();
    router.push("/");
  }, [router]);

  // 派生状態
  const isGenerating = phase === "generating" || phase === "regenerating";
  const isReviewing = phase === "reviewing";
  const showThinking = isGenerating && !!thinking.thinkingContent;
  const showReviewThinking = isReviewing && !!reviewThinking.thinkingContent;
  const displayContent = streamingContent || output?.content || "";

  return useMemo(
    () => ({
      // 状態
      isValidParams,
      phase,
      output,
      streamingContent,
      aiFeedback,
      streamingFeedback,

      // 派生状態
      isGenerating,
      isReviewing,
      showThinking,
      showReviewThinking,
      displayContent,

      // Thinking 状態
      thinking: {
        content: thinking.thinkingContent,
      },
      reviewThinking: {
        content: reviewThinking.thinkingContent,
      },

      // アクション
      requestReview,
      applyFeedback,
      startOver,
    }),
    [
      isValidParams,
      phase,
      output,
      streamingContent,
      aiFeedback,
      streamingFeedback,
      isGenerating,
      isReviewing,
      showThinking,
      showReviewThinking,
      displayContent,
      thinking.thinkingContent,
      reviewThinking.thinkingContent,
      requestReview,
      applyFeedback,
      startOver,
    ]
  );
}

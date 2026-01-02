"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { OutputCard } from "@/components/pages/result/OutputCard";
import { AIFeedbackCard } from "@/components/pages/result/AIFeedbackCard";
import { ResultHeader } from "@/components/pages/result/ResultHeader";
import { ThinkingPanel } from "@/components/projects/ThinkingPanel";
import { StreamingText } from "@/components/projects/StreamingText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadChatData, clearChatData, saveChatData } from "@/hooks";
import { useThinking } from "@/hooks/useThinking";
import { readTextSSEStream } from "@/lib/sse";
import type { MeetingType, StructuredOutput, ChatMessage } from "@/types";

/**
 * 結果ページのフェーズ
 */
type ResultPhase =
  | "generating" // 初回出力生成中
  | "complete" // 出力完了、表示中
  | "regenerating" // 再生成中
  | "reviewing"; // AIレビュー中

/** 結果ページ本体 */
// eslint-disable-next-line max-lines-per-function
function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as MeetingType | null;
  const isValidParams = !!type;

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

  // データをロード
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
      } finally {
        thinking.stopThinking();
      }
    },
    [type, messages, thinking]
  );

  // 初回出力生成
  useEffect(() => {
    if (isLoaded && messages.length > 0 && !output && !generationStarted.current) {
      generationStarted.current = true;
      generateOutput();
    }
  }, [isLoaded, messages.length, output, generateOutput]);

  /**
   * AIレビューを実行
   */
  const handleRequestReview = useCallback(async () => {
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
    } finally {
      reviewThinking.stopThinking();
    }
  }, [type, messages, output, reviewThinking]);

  /**
   * AIフィードバックを反映して再生成
   */
  const handleApplyFeedback = useCallback(async () => {
    if (output && aiFeedback) {
      await generateOutput(aiFeedback, output);
    }
  }, [output, aiFeedback, generateOutput]);

  const handleStartOver = useCallback(() => {
    clearChatData();
    router.push("/");
  }, [router]);

  if (!isValidParams) return null;

  const isGenerating = phase === "generating" || phase === "regenerating";
  const isReviewing = phase === "reviewing";
  const showThinking = isGenerating && (thinking.isThinking || thinking.thinkingContent);
  const showReviewThinking =
    isReviewing && (reviewThinking.isThinking || reviewThinking.thinkingContent);
  const displayContent = streamingContent || output?.content || "";

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <ResultHeader />

        {/* ThinkingPanel: 生成中に表示 */}
        {showThinking && (
          <ThinkingPanel
            isThinking={thinking.isThinking}
            content={thinking.thinkingContent}
            title={phase === "regenerating" ? "修正を考え中..." : "文章を考え中..."}
          />
        )}

        {/* ThinkingPanel: レビュー中に表示 */}
        {showReviewThinking && (
          <ThinkingPanel
            isThinking={reviewThinking.isThinking}
            content={reviewThinking.thinkingContent}
            title="資料をレビュー中..."
          />
        )}

        {/* 出力カード or ストリーミング表示 */}
        {isGenerating && !displayContent ? (
          <Card>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>文章を生成しています...</span>
            </div>
          </Card>
        ) : isGenerating && streamingContent ? (
          <Card>
            <StreamingText content={streamingContent} isStreaming={true} />
          </Card>
        ) : output ? (
          <OutputCard output={output} />
        ) : null}

        {/* AIレビューボタン: 完了時かつレビュー未実行 */}
        {phase === "complete" && output && !aiFeedback && (
          <div className="text-center">
            <Button onClick={handleRequestReview} variant="primary">
              🔍 AIにレビューしてもらう
            </Button>
          </div>
        )}

        {/* AIフィードバックカード */}
        {(isReviewing || aiFeedback) && (
          <AIFeedbackCard
            content={streamingFeedback || aiFeedback}
            isStreaming={isReviewing}
            onApplyFeedback={aiFeedback ? handleApplyFeedback : undefined}
            isRegenerating={phase === "regenerating"}
          />
        )}

        <div className="text-center">
          <Button variant="secondary" onClick={handleStartOver} className="text-stone-500">
            🔄 最初からやり直す
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-stone-500">読み込み中...</p>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OutputCard } from "@/components/pages/result/OutputCard";
import { AIFeedbackCard } from "@/components/pages/result/AIFeedbackCard";
import { ResultHeader } from "@/components/pages/result/ResultHeader";
import { ThinkingPanel } from "@/components/projects/ThinkingPanel";
import { StreamingText } from "@/components/projects/StreamingText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/PageLoading";
import { useResult } from "@/hooks";
import type { MeetingType } from "@/types";

/** 結果ページ本体 */
function ResultPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as MeetingType | null;

  const result = useResult({ type });

  if (!result.isValidParams) return null;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <ResultHeader />

        {/* ThinkingPanel: contentがあれば表示、思考完了時は自動で閉じる */}
        {result.thinking.content && (
          <ThinkingPanel content={result.thinking.content} isThinking={result.showThinking} />
        )}

        {/* 出力カード or ストリーミング表示 */}
        {result.isGenerating && !result.displayContent ? (
          <Card>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>文章を生成しています...</span>
            </div>
          </Card>
        ) : result.isGenerating && result.streamingContent ? (
          <Card>
            <StreamingText content={result.streamingContent} isStreaming={true} />
          </Card>
        ) : result.output ? (
          <OutputCard output={result.output} />
        ) : null}

        {/* AIレビューボタン: 完了時かつレビュー未実行 */}
        {result.phase === "complete" && result.output && !result.aiFeedback && (
          <div className="text-center">
            <Button onClick={result.requestReview} variant="primary">
              🔍 AIにレビューしてもらう
            </Button>
          </div>
        )}

        {/* ThinkingPanel: contentがあれば表示、レビュー完了時は自動で閉じる */}
        {result.reviewThinking.content && (
          <ThinkingPanel content={result.reviewThinking.content} isThinking={result.showReviewThinking} />
        )}

        {/* AIフィードバックカード */}
        {(result.isReviewing || result.aiFeedback) && (
          <AIFeedbackCard
            content={result.streamingFeedback || result.aiFeedback}
            isStreaming={result.isReviewing}
            onApplyFeedback={result.aiFeedback ? result.applyFeedback : undefined}
            isRegenerating={result.phase === "regenerating"}
          />
        )}

        {result.phase !== "generating" && (
          <div className="text-center">
            <Button variant="secondary" onClick={result.startOver} className="text-stone-500">
              🔄 最初からやり直す
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ResultPageContent />
    </Suspense>
  );
}

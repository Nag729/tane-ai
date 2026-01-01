"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { OutputCard } from "@/components/OutputCard";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { HorensoType, StructuredOutput, OutputFormat } from "@/types";

// モックの出力データ（Phase 5 で API に置き換え）
const mockOutput: StructuredOutput = {
  markdown: `## 📊 報告：プロジェクトの進捗状況

### 結論
現在、予定より **1週間遅れ** で進行中です。

### 詳細
- デザインフェーズは完了
- 開発フェーズで技術的な課題が発生
- チームで解決策を検討中

### 次のアクション
1. 来週月曜までに代替案を3つ提示
2. 水曜のMTGで最終決定

---
*何かご質問があればお気軽にどうぞ！*`,

  plaintext: `【報告】プロジェクトの進捗状況

■ 結論
現在、予定より1週間遅れで進行中です。

■ 詳細
・デザインフェーズは完了
・開発フェーズで技術的な課題が発生
・チームで解決策を検討中

■ 次のアクション
1. 来週月曜までに代替案を3つ提示
2. 水曜のMTGで最終決定

何かご質問があればお気軽にどうぞ！`,
};

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const isValidParams = !!type;

  const [output, setOutput] = useState<StructuredOutput>(mockOutput);
  const [format, setFormat] = useState<OutputFormat>("markdown");
  const [isRegenerating, setIsRegenerating] = useState(false);

  // 無効なパラメータの場合はトップへリダイレクト
  useEffect(() => {
    if (!isValidParams) {
      router.replace("/");
    }
  }, [isValidParams, router]);

  if (!isValidParams) {
    return null;
  }

  const handleRegenerate = async (feedback: string) => {
    setIsRegenerating(true);

    // モック：フィードバックを反映した風の出力（Phase 5 で API に置き換え）
    setTimeout(() => {
      setOutput({
        markdown: mockOutput.markdown + `\n\n### 📝 追記\n${feedback}を反映しました。`,
        plaintext: mockOutput.plaintext + `\n\n■ 追記\n${feedback}を反映しました。`,
      });
      setIsRegenerating(false);
    }, 1500);
  };

  const handleStartOver = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ヘッダー */}
        <Card className="text-center">
          <p className="text-4xl mb-2">🎉</p>
          <h1 className="text-2xl font-bold text-stone-800 mb-1">整理完了！</h1>
          <p className="text-stone-600">内容をコピーして使ってね</p>
        </Card>

        {/* 出力カード */}
        <OutputCard output={output} format={format} onFormatChange={setFormat} />

        {/* フィードバックフォーム */}
        <Card>
          <FeedbackForm onSubmit={handleRegenerate} isLoading={isRegenerating} />
        </Card>

        {/* やり直しボタン */}
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

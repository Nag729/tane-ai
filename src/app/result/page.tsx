"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { OutputCard } from "@/components/OutputCard";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadChatData, clearChatData } from "@/hooks";
import { regenerateOutput } from "@/actions/chat";
import type { HorensoType, StructuredOutput, ChatMessage } from "@/types";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const isValidParams = !!type;

  const [output, setOutput] = useState<StructuredOutput | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // sessionStorage からデータを読み込み
  useEffect(() => {
    const chatData = loadChatData();
    if (chatData?.output) {
      setOutput(chatData.output);
      setMessages(chatData.messages);
    }
    setIsLoaded(true);
  }, []);

  // 無効なパラメータの場合はトップへリダイレクト
  useEffect(() => {
    if (!isValidParams) {
      router.replace("/");
    }
  }, [isValidParams, router]);

  // データがない場合はトップへリダイレクト
  useEffect(() => {
    if (isLoaded && !output) {
      router.replace("/");
    }
  }, [isLoaded, output, router]);

  if (!isValidParams || !output) {
    return null;
  }

  const handleRegenerate = async (feedback: string) => {
    if (!type) return;

    setIsRegenerating(true);
    try {
      const newOutput = await regenerateOutput(type, messages, output, feedback);
      setOutput(newOutput);
    } catch (error) {
      console.error("Failed to regenerate output:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStartOver = () => {
    clearChatData();
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
        <OutputCard output={output} />

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

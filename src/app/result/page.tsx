"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { OutputCard } from "@/components/OutputCard";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadChatData, clearChatData } from "@/hooks";
import type { HorensoType, StructuredOutput, ChatMessage } from "@/types";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const isValidParams = !!type;

  const [output, setOutput] = useState<StructuredOutput | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
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
    setStreamingContent("");

    try {
      const response = await fetch("/api/chat/output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          messages,
          previousOutput: output,
          feedback,
        }),
      });

      let fullText = "";
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "text") {
              fullText += data.text;
              setStreamingContent(fullText);
            } else if (data.type === "error") {
              throw new Error(data.error);
            }
          }
        }
      }

      setOutput({ content: fullText });
      setStreamingContent("");
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

  // ストリーミング中は途中経過を表示
  const displayContent = streamingContent || output.content;

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
        {isRegenerating && streamingContent ? (
          <Card className="space-y-4">
            <h2 className="text-lg font-medium text-stone-800">📋 再生成中...</h2>
            <div className="bg-stone-50 rounded-xl p-4 min-h-32">
              <div className="prose prose-stone prose-sm max-w-none">
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
            </div>
          </Card>
        ) : (
          <OutputCard output={{ content: displayContent }} />
        )}

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

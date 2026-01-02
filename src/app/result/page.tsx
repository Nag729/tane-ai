"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { OutputCard } from "@/components/pages/result/OutputCard";
import { FeedbackForm } from "@/components/pages/result/FeedbackForm";
import { ResultHeader } from "@/components/pages/result/ResultHeader";
import { RegeneratingCard } from "@/components/pages/result/RegeneratingCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadChatData, clearChatData } from "@/hooks";
import { readTextSSEStream } from "@/lib/sse";
import type { MeetingType, StructuredOutput, ChatMessage } from "@/types";

/** 結果ページ本体 */
function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as MeetingType | null;
  const isValidParams = !!type;

  const [output, setOutput] = useState<StructuredOutput | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const chatData = loadChatData();
    if (chatData?.output) {
      setOutput(chatData.output);
      setMessages(chatData.messages);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isValidParams) router.replace("/");
  }, [isValidParams, router]);

  useEffect(() => {
    if (isLoaded && !output) router.replace("/");
  }, [isLoaded, output, router]);

  const handleRegenerate = useCallback(
    async (feedback: string) => {
      if (!type) return;

      setIsRegenerating(true);
      setStreamingContent("");

      try {
        const response = await fetch("/api/chat/output", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, messages, previousOutput: output, feedback }),
        });

        const fullText = await readTextSSEStream(response, {
          onTextAccumulated: setStreamingContent,
        });
        setOutput({ content: fullText });
        setStreamingContent("");
      } catch (error) {
        console.error("Failed to regenerate output:", error);
      } finally {
        setIsRegenerating(false);
      }
    },
    [type, messages, output]
  );

  const handleStartOver = useCallback(() => {
    clearChatData();
    router.push("/");
  }, [router]);

  if (!isValidParams || !output) return null;

  const displayContent = streamingContent || output.content;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <ResultHeader />

        {isRegenerating && streamingContent ? (
          <RegeneratingCard content={streamingContent} />
        ) : (
          <OutputCard output={{ content: displayContent }} />
        )}

        <Card>
          <FeedbackForm onSubmit={handleRegenerate} isLoading={isRegenerating} />
        </Card>

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

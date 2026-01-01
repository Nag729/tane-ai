"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { InitialInputForm } from "@/components/pages/home/InitialInputForm";
import { ThinkingPanel } from "@/components/projects/ThinkingPanel";
import { ChatHeader } from "@/components/pages/chat/ChatHeader";
import { ChatHistory } from "@/components/pages/chat/ChatHistory";
import { ChatFooter } from "@/components/pages/chat/ChatFooter";
import { StreamingOutputCard } from "@/components/pages/chat/StreamingOutputCard";
import { Card } from "@/components/ui/Card";
import { useChatAnswers, useChat } from "@/hooks";
import { typeConfig } from "@/constants";
import { isDebugMode, getRandomTestData } from "@/debug/testData";
import type { HorensoType } from "@/types";

// eslint-disable-next-line max-lines-per-function
function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") as HorensoType | null;
  const config = type ? typeConfig[type] : null;

  const debugDefaultValues = useMemo(
    () => (isDebugMode() && type ? getRandomTestData(type) : undefined),
    [type]
  );

  const [initialInputSubmitted, setInitialInputSubmitted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chat = useChat({
    type: type || "report",
    onComplete: () => router.push(`/result?type=${type}`),
  });

  const {
    answers,
    handleOptionChange,
    handleCustomInputChange,
    checkAllAnswered,
    resetAnswers,
    buildQuestionAnswers,
  } = useChatAnswers();

  // 自動スクロール
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.thinkingContent, chat.streamingOutput, chat.isLoading]);

  // 無効なパラメータの場合はトップへ
  useEffect(() => {
    if (!type) router.replace("/");
  }, [type, router]);

  if (!type || !config) return null;

  const handleInitialSubmit = async (data: {
    topic: string;
    recipient: string;
    detail: string;
  }) => {
    setInitialInputSubmitted(true);
    await chat.submitInitialInput(data);
  };

  const handleSubmit = async () => {
    if (!chat.currentAIMessage) return;
    await chat.submitAnswer(buildQuestionAnswers(chat.currentAIMessage.questions));
    resetAnswers();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const canSubmitNow =
      chat.hasQuestions &&
      chat.currentAIMessage &&
      checkAllAnswered(chat.currentAIMessage.questions);
    if (e.key === "Enter" && !e.shiftKey && canSubmitNow) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = Boolean(
    chat.hasQuestions && chat.currentAIMessage && checkAllAnswered(chat.currentAIMessage.questions)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader label={config.label} onBack={() => router.push("/")} />

      <main className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="max-w-2xl mx-auto space-y-4">
          {!initialInputSubmitted ? (
            <InitialInputForm
              fields={config.fields}
              onSubmit={handleInitialSubmit}
              defaultValues={debugDefaultValues}
            />
          ) : (
            <>
              <ChatHistory
                messages={chat.messages}
                getAnswerDisplay={chat.getAnswerDisplay}
                isLoading={chat.isLoading && !chat.isThinking && !chat.streamingOutput}
              />
              <ThinkingPanel isThinking={chat.isThinking} content={chat.thinkingContent} />
              <StreamingOutputCard content={chat.streamingOutput} isStreaming={chat.isLoading} />
              {chat.error && (
                <Card className="bg-red-50 border-red-200">
                  <p className="text-red-600">{chat.error}</p>
                </Card>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </div>
      </main>

      {initialInputSubmitted && (
        <ChatFooter
          isReady={chat.isReady}
          isLoading={chat.isLoading}
          hasQuestions={chat.hasQuestions}
          currentAIMessage={chat.currentAIMessage}
          answers={answers}
          canSubmit={canSubmit}
          onComplete={chat.completeAndGenerate}
          onSubmit={handleSubmit}
          onOptionChange={handleOptionChange}
          onCustomInputChange={handleCustomInputChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-stone-500">読み込み中...</p>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

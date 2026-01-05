"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { InitialInputForm } from "@/components/pages/home/InitialInputForm";
import { ThinkingPanel } from "@/components/projects/ThinkingPanel";
import { ChatHeader } from "@/components/pages/chat/ChatHeader";
import { ChatHistory } from "@/components/pages/chat/ChatHistory";
import { ChatFooter } from "@/components/pages/chat/ChatFooter";
import { QuestionCard } from "@/components/pages/chat/QuestionCard";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { useChatAnswers, useChat } from "@/hooks";
import { typeConfig, verbsByType, supplementLabels } from "@/constants";
import { getSampleCasesByType } from "@/constants/sampleCases";
import type { MeetingType, InitialInputData } from "@/types";

// eslint-disable-next-line max-lines-per-function
function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") as MeetingType | null;
  const config = type ? typeConfig[type] : null;

  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>();
  const sampleCases = useMemo(() => (type ? getSampleCasesByType(type) : []), [type]);
  const selectedSample = sampleCases.find((s) => s.id === selectedSampleId)?.data;

  const handleSampleSelect = (id: string) => {
    setSelectedSampleId(id);
  };

  const latestContentRef = useRef<HTMLDivElement>(null);

  const chat = useChat({
    type: type || "decision",
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

  // 自動スクロール（最新コンテンツへ）
  useEffect(() => {
    latestContentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.thinkingContent, chat.phase]);

  // 無効なパラメータの場合はトップへ
  useEffect(() => {
    if (!type) router.replace("/");
  }, [type, router]);

  if (!type || !config) return null;

  const handleInitialSubmit = async (data: InitialInputData) => {
    await chat.submitInitialInput(data);
  };

  const handleSubmit = async () => {
    if (!chat.currentAIMessage) return;
    await chat.submitAnswer(buildQuestionAnswers(chat.currentAIMessage.questions));
    resetAnswers();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // IME変換中は無視
    if (e.nativeEvent.isComposing) return;

    const canSubmitNow =
      chat.hasQuestions &&
      chat.currentAIMessage &&
      checkAllAnswered(chat.currentAIMessage.questions);

    // Command/Ctrl + Enter でのみ送信
    const isSubmitShortcut = (e.metaKey || e.ctrlKey) && e.key === "Enter";

    if (isSubmitShortcut && canSubmitNow) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = Boolean(
    chat.hasQuestions && chat.currentAIMessage && checkAllAnswered(chat.currentAIMessage.questions)
  );

  // フェーズに基づいた表示制御
  const showInitialForm = chat.phase === "idle";
  const showThinking = chat.phase === "thinking";
  const showQuestions = chat.phase === "answering" && chat.hasQuestions && chat.currentAIMessage;
  const showFooter = chat.phase !== "idle";

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader label={config.label} onBack={() => router.push("/")} />

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {showInitialForm ? (
            <InitialInputForm
              key={selectedSampleId ?? "empty"}
              themePlaceholder={config.themePlaceholder}
              verbs={verbsByType[type]}
              supplementLabels={supplementLabels}
              onSubmit={handleInitialSubmit}
              defaultValues={selectedSample}
              sampleCases={sampleCases.map((s) => ({ id: s.id, label: s.label }))}
              onSampleSelect={handleSampleSelect}
            />
          ) : (
            <>
              <ChatHistory messages={chat.messages} getAnswerDisplay={chat.getAnswerDisplay} />

              {/* スクロール位置: 最新の質問/Thinking の先頭 */}
              <div ref={latestContentRef} />

              {/* ThinkingPanel: thinking フェーズで表示 */}
              {showThinking && (
                <ThinkingPanel isThinking={chat.isThinking} content={chat.thinkingContent} />
              )}

              {chat.error && (
                <Card className="bg-red-50 border-red-200">
                  <p className="text-red-600">{chat.error}</p>
                </Card>
              )}

              {/* 質問カード: answering フェーズで表示 */}
              {showQuestions && chat.currentAIMessage && (
                <div className="space-y-3">
                  {chat.currentAIMessage.questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selectedIds={answers[q.id]?.selectedIds || []}
                      customInput={answers[q.id]?.customInput || ""}
                      onOptionChange={(ids) => handleOptionChange(q.id, ids)}
                      onCustomInputChange={(value) => handleCustomInputChange(q.id, value)}
                      onKeyDown={handleKeyDown}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showFooter && (
        <ChatFooter
          isReady={chat.isReady}
          isLoading={chat.isLoading}
          canSubmit={canSubmit}
          onComplete={chat.completeChat}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ChatPageContent />
    </Suspense>
  );
}

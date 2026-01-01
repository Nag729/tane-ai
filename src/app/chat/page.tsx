"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { AIMessageBubble } from "@/components/AIMessageBubble";
import { UserMessageBubble } from "@/components/UserMessageBubble";
import { ChoiceChips } from "@/components/ChoiceChips";
import { InitialInputForm } from "@/components/InitialInputForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useChatAnswers, useMockChat } from "@/hooks";
import { typeConfig } from "@/constants";
import type { HorensoType } from "@/types";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const isValidParams = !!type;
  const config = type ? typeConfig[type] : null;

  // 初期入力完了フラグ
  const [initialInputSubmitted, setInitialInputSubmitted] = useState(false);

  // チャットフロー
  const chat = useMockChat({
    onComplete: () => router.push(`/result?type=${type}`),
  });

  // 回答入力の状態管理
  const {
    answers,
    handleOptionChange,
    handleCustomInputChange,
    checkAllAnswered,
    resetAnswers,
    buildQuestionAnswers,
  } = useChatAnswers();

  // 無効なパラメータの場合はトップへリダイレクト
  useEffect(() => {
    if (!isValidParams) {
      router.replace("/");
    }
  }, [isValidParams, router]);

  if (!isValidParams || !config) {
    return null;
  }

  // 初期入力送信
  const handleInitialSubmit = (data: { topic: string; recipient: string; detail: string }) => {
    const initialText = `${data.topic}を${data.recipient}に${config.label}したい。${data.detail}`;
    chat.submitInitialInput(config.label, initialText);
    setInitialInputSubmitted(true);
  };

  // 回答送信
  const handleSubmit = () => {
    if (!chat.currentAIMessage) return;
    const questionAnswers = buildQuestionAnswers(chat.currentAIMessage.questions);
    chat.submitAnswer(questionAnswers);
    resetAnswers();
  };

  // Enter キーで送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const canSubmit =
      chat.hasQuestions &&
      chat.currentAIMessage &&
      checkAllAnswered(chat.currentAIMessage.questions);

    if (e.key === "Enter" && !e.shiftKey && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit =
    chat.hasQuestions && chat.currentAIMessage && checkAllAnswered(chat.currentAIMessage.questions);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/")} className="text-stone-500 hover:text-stone-700">
            ← やめる
          </button>
          <h1 className="font-bold text-stone-800">🤖 {config.label}を整理中</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* メインエリア */}
      <main className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="max-w-2xl mx-auto space-y-4">
          {!initialInputSubmitted ? (
            <InitialInputForm fields={config.fields} onSubmit={handleInitialSubmit} />
          ) : (
            <ChatHistory
              messages={chat.messages}
              getAnswerDisplay={chat.getAnswerDisplay}
              isStreaming={chat.isStreaming}
            />
          )}
        </div>
      </main>

      {/* 入力エリア */}
      {initialInputSubmitted && (
        <footer className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
          <div className="max-w-2xl mx-auto space-y-3">
            {!chat.isStreaming &&
              chat.hasQuestions &&
              chat.currentAIMessage?.questions.map((q) => (
                <Card key={q.id} className="space-y-2">
                  <p className="text-stone-700 font-medium text-sm">
                    {q.content}
                    {q.multiSelect && <span className="text-stone-400 ml-2">（複数OK）</span>}
                  </p>
                  <ChoiceChips
                    options={q.options}
                    selectedIds={answers[q.id]?.selectedIds || []}
                    onChange={(ids) => handleOptionChange(q.id, ids)}
                    multiSelect={q.multiSelect}
                  />
                  <Input
                    value={answers[q.id]?.customInput || ""}
                    onChange={(e) => handleCustomInputChange(q.id, e.target.value)}
                    placeholder={q.customInputPlaceholder || "自由に入力..."}
                    onKeyDown={handleKeyDown}
                    className="mt-2"
                  />
                </Card>
              ))}

            {canSubmit && (
              <Button onClick={handleSubmit} className="w-full">
                次へ →
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

// チャット履歴コンポーネント
type ChatHistoryProps = {
  messages: ReturnType<typeof useMockChat>["messages"];
  getAnswerDisplay: ReturnType<typeof useMockChat>["getAnswerDisplay"];
  isStreaming: boolean;
};

function ChatHistory({ messages, getAnswerDisplay, isStreaming }: ChatHistoryProps) {
  return (
    <>
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.role === "ai" ? (
            <div className="space-y-3">
              {msg.message.intro && <AIMessageBubble content={msg.message.intro} />}
            </div>
          ) : (
            <UserMessageBubble content={getAnswerDisplay(msg)} />
          )}
        </div>
      ))}

      {isStreaming && <AIMessageBubble content="..." isStreaming={true} />}
    </>
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

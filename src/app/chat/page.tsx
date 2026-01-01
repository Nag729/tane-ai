"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { AIMessageBubble } from "@/components/AIMessageBubble";
import { UserMessageBubble } from "@/components/UserMessageBubble";
import { ChoiceChips } from "@/components/ChoiceChips";
import { InitialInputForm } from "@/components/InitialInputForm";
import { ThinkingPanel } from "@/components/ThinkingPanel";
import { StreamingText } from "@/components/StreamingText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useChatAnswers, useChat } from "@/hooks";
import { typeConfig } from "@/constants";
import { isDebugMode, getRandomTestData } from "@/debug/testData";
import type { HorensoType, ChatMessage } from "@/types";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const isValidParams = !!type;
  const config = type ? typeConfig[type] : null;

  // デバッグモード時のテストデータ（初回レンダリング時のみ生成）
  const debugDefaultValues = useMemo(
    () => (isDebugMode() && type ? getRandomTestData(type) : undefined),
    [type]
  );

  // 初期入力完了フラグ
  const [initialInputSubmitted, setInitialInputSubmitted] = useState(false);

  // チャットフロー
  const chat = useChat({
    type: type || "report",
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

  // チャットエリアの自動スクロール
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.thinkingContent, chat.streamingOutput, chat.isLoading]);

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
  const handleInitialSubmit = async (data: {
    topic: string;
    recipient: string;
    detail: string;
  }) => {
    setInitialInputSubmitted(true);
    await chat.submitInitialInput(data);
  };

  // 回答送信
  const handleSubmit = async () => {
    if (!chat.currentAIMessage) return;
    const questionAnswers = buildQuestionAnswers(chat.currentAIMessage.questions);
    await chat.submitAnswer(questionAnswers);
    resetAnswers();
  };

  // 整理完了
  const handleComplete = async () => {
    await chat.completeAndGenerate();
  };

  // Enter キーで送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const canSubmitAnswer =
      chat.hasQuestions &&
      chat.currentAIMessage &&
      checkAllAnswered(chat.currentAIMessage.questions);

    if (e.key === "Enter" && !e.shiftKey && canSubmitAnswer) {
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

              {/* 思考過程の表示 */}
              <ThinkingPanel isThinking={chat.isThinking} content={chat.thinkingContent} />

              {/* 出力生成中のストリーミング表示 */}
              {chat.streamingOutput && (
                <Card className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-600">📝 出力を生成中...</h3>
                  <div className="bg-stone-50 rounded-lg p-3 max-h-96 overflow-y-auto">
                    <StreamingText content={chat.streamingOutput} isStreaming={chat.isLoading} />
                  </div>
                </Card>
              )}

              {chat.error && (
                <Card className="bg-red-50 border-red-200">
                  <p className="text-red-600">{chat.error}</p>
                </Card>
              )}

              {/* 自動スクロール用のアンカー */}
              <div ref={chatEndRef} />
            </>
          )}
        </div>
      </main>

      {/* 入力エリア */}
      {initialInputSubmitted && (
        <footer className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
          <div className="max-w-2xl mx-auto space-y-3">
            {/* 整理完了ボタン（AI が ready と判断したら表示） */}
            {chat.isReady && !chat.isLoading && (
              <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
                ✨ 整理完了！結果を見る
              </Button>
            )}

            {!chat.isLoading &&
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

            {canSubmit && !chat.isLoading && (
              <Button onClick={handleSubmit} className="w-full">
                次へ →
              </Button>
            )}

            {chat.isLoading && <p className="text-center text-stone-500">思考中...</p>}
          </div>
        </footer>
      )}
    </div>
  );
}

// チャット履歴コンポーネント
type ChatHistoryProps = {
  messages: ChatMessage[];
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
  isLoading: boolean;
};

function ChatHistory({ messages, getAnswerDisplay, isLoading }: ChatHistoryProps) {
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

      {isLoading && <AIMessageBubble content="..." isStreaming={true} />}
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

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { AIMessageBubble } from "@/components/AIMessageBubble";
import { ChoiceChips } from "@/components/ChoiceChips";
import { ChatInput } from "@/components/ChatInput";
import { Button } from "@/components/ui/Button";
import type { HorensoType, AIQuestion, ChatMessage } from "@/types";

// モックの質問データ（Phase 5 で API に置き換え）
const mockQuestions: AIQuestion[] = [
  {
    id: "q1",
    content:
      "なるほど！まずは詳しく教えて 🤔\n\nこの内容は、どのくらい緊急性がありますか？",
    options: [
      { id: "urgent", label: "今すぐ対応が必要" },
      { id: "soon", label: "今週中には" },
      { id: "later", label: "急ぎではない" },
    ],
    multiSelect: false,
  },
  {
    id: "q2",
    content: "了解！次に、相手にどんなアクションを期待していますか？",
    options: [
      { id: "approve", label: "承認・決裁" },
      { id: "feedback", label: "フィードバック" },
      { id: "info", label: "情報共有のみ" },
      { id: "help", label: "助けが欲しい" },
    ],
    multiSelect: true,
  },
  {
    id: "q3",
    content:
      "いい感じに情報が集まってきたね ✨\n\n最後に、何か補足しておきたいことはある？",
    options: [
      { id: "none", label: "特にない" },
      { id: "risk", label: "リスクがある" },
      { id: "alternative", label: "代替案がある" },
    ],
    multiSelect: false,
  },
];

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;
  const purpose = searchParams.get("purpose");
  const recipient = searchParams.get("recipient");
  const background = searchParams.get("background");

  // 初回メッセージを最初から設定
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "ai", question: mockQuestions[0] },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  const isValidParams = !!(type && purpose && recipient && background);

  // パラメータ検証 - 無効な場合はリダイレクト
  useEffect(() => {
    if (!isValidParams) {
      router.replace("/");
    }
  }, [isValidParams, router]);

  // 無効な場合は何も表示しない
  if (!isValidParams) {
    return null;
  }

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= mockQuestions.length - 1;

  const handleAnswer = (customInput?: string) => {
    if (selectedIds.length === 0 && !customInput) return;

    // ユーザーの回答を追加
    const userAnswer: ChatMessage = {
      role: "user",
      answer: {
        questionId: currentQuestion.id,
        selectedOptionIds: selectedIds,
        customInput: customInput,
      },
    };

    setMessages((prev) => [...prev, userAnswer]);
    setSelectedIds([]);

    if (isLastQuestion) {
      // 最後の質問の場合、完了ボタンを表示
      setShowCompleteButton(true);
    } else {
      // 次の質問へ
      setIsStreaming(true);
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setMessages((prev) => [
          ...prev,
          { role: "ai", question: mockQuestions[nextIndex] },
        ]);
        setIsStreaming(false);
      }, 600);
    }
  };

  const handleComplete = () => {
    // 結果ページへ遷移
    const params = new URLSearchParams({
      type,
      purpose,
      recipient,
      background,
    });
    router.push(`/result?${params.toString()}`);
  };

  // ユーザーの回答を表示用に変換
  const getAnswerDisplay = (answer: ChatMessage) => {
    if (answer.role !== "user") return "";
    const { selectedOptionIds, customInput } = answer.answer;

    const selectedLabels = selectedOptionIds
      .map((id) => {
        for (const q of mockQuestions) {
          const opt = q.options.find((o) => o.id === id);
          if (opt) return opt.label;
        }
        return id;
      })
      .join("、");

    if (customInput) {
      return selectedLabels ? `${selectedLabels}\n${customInput}` : customInput;
    }
    return selectedLabels;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-stone-500 hover:text-stone-700"
          >
            ← 戻る
          </button>
          <h1 className="font-bold text-stone-800">🤖 AI と対話中</h1>
          <div className="w-12" /> {/* スペーサー */}
        </div>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.role === "ai" ? (
                <AIMessageBubble
                  content={message.question.content}
                  isStreaming={false}
                />
              ) : (
                <div className="flex justify-end">
                  <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="whitespace-pre-wrap">
                      {getAnswerDisplay(message)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <AIMessageBubble content="考え中..." isStreaming={true} />
          )}
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-stone-200 p-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto space-y-3">
          {showCompleteButton ? (
            <Button onClick={handleComplete} className="w-full">
              整理完了 ✨
            </Button>
          ) : (
            <>
              {currentQuestion && !isStreaming && (
                <ChoiceChips
                  options={currentQuestion.options}
                  selectedIds={selectedIds}
                  onChange={setSelectedIds}
                  multiSelect={currentQuestion.multiSelect}
                />
              )}

              <ChatInput
                onSubmit={(value) => handleAnswer(value)}
                placeholder="自由に入力することもできるよ..."
                disabled={isStreaming}
              />

              {selectedIds.length > 0 && (
                <Button onClick={() => handleAnswer()} className="w-full">
                  この回答で進む →
                </Button>
              )}
            </>
          )}
        </div>
      </div>
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

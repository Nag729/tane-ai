"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { AIMessageBubble } from "@/components/AIMessageBubble";
import { UserMessageBubble } from "@/components/UserMessageBubble";
import { ChoiceChips } from "@/components/ChoiceChips";
import { InitialInputForm } from "@/components/InitialInputForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type {
  HorensoType,
  AIMessage,
  ChatMessage,
  QuestionAnswer,
  AnswerState,
} from "@/types";

type FieldConfig = {
  label: string;
  placeholder: string;
};

type TypeConfigItem = {
  label: string;
  fields: {
    topic: FieldConfig;
    recipient: FieldConfig;
    detail: FieldConfig;
  };
};

const typeConfig = {
  report: {
    label: "報告",
    fields: {
      topic: {
        label: "何を報告する？",
        placeholder: "例：新機能の開発進捗",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：開発チームのリーダー山田さん",
      },
      detail: {
        label: "現状は？",
        placeholder: "例：予定より1週間遅れてる。原因はAPIの仕様変更",
      },
    },
  },
  contact: {
    label: "連絡",
    fields: {
      topic: {
        label: "何を連絡する？",
        placeholder: "例：来週のミーティング日程変更",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：プロジェクトメンバー全員",
      },
      detail: {
        label: "伝えたい内容は？",
        placeholder: "例：水曜14時から木曜10時に変更したい",
      },
    },
  },
  consult: {
    label: "相談",
    fields: {
      topic: {
        label: "何を相談する？",
        placeholder: "例：タスクの優先順位の付け方",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：チームリーダーの佐藤さん",
      },
      detail: {
        label: "困っていることは？",
        placeholder: "例：急ぎの依頼が重なって何から手をつけるべきかわからない",
      },
    },
  },
} as const satisfies Record<HorensoType, TypeConfigItem>;

// 励ましのリアクション
const encouragements = [
  "いいね！",
  "なるほど〜",
  "オッケー！",
  "了解！",
  "ふむふむ",
  "わかった！",
] as const;

const getRandomEncouragement = () =>
  encouragements[Math.floor(Math.random() * encouragements.length)];

// モックの会話フロー（Phase 5 で API に置き換え）
const createFollowUpMessages = (): AIMessage[] => [
  {
    id: "m2",
    intro: `${getRandomEncouragement()} もうちょっと教えて`,
    questions: [
      {
        id: "q1",
        content: "どのくらい急ぎ？",
        options: [
          { id: "urgent", label: "今すぐ！" },
          { id: "soon", label: "今週中" },
          { id: "later", label: "急ぎじゃない" },
        ],
        multiSelect: false,
      },
      {
        id: "q2",
        content: "相手に何をしてほしい？",
        options: [
          { id: "approve", label: "承認・決裁" },
          { id: "feedback", label: "意見がほしい" },
          { id: "info", label: "知っておいてほしいだけ" },
        ],
        multiSelect: true,
        customInputPlaceholder: "他にあれば...",
      },
    ],
  },
];

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const type = searchParams.get("type") as HorensoType | null;

  // 初期入力完了フラグ
  const [initialInputSubmitted, setInitialInputSubmitted] = useState(false);

  // チャットの状態
  const [mockMessages, setMockMessages] = useState<AIMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [isStreaming, setIsStreaming] = useState(false);

  const isValidParams = !!type;
  const config = type ? typeConfig[type] : null;

  useEffect(() => {
    if (!isValidParams) {
      router.replace("/");
    }
  }, [isValidParams, router]);

  // スクロール
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isValidParams || !config) {
    return null;
  }

  // 初期入力送信
  const handleInitialSubmit = (data: {
    topic: string;
    recipient: string;
    detail: string;
  }) => {
    const initialText = `${data.topic}を${data.recipient}に${config.label}したい。${data.detail}`;

    // 初期メッセージを作成
    const followUpMessages = createFollowUpMessages();
    setMockMessages(followUpMessages);

    // AIの挨拶 + ユーザーの入力
    setMessages([
      {
        role: "ai",
        message: {
          id: "m0",
          intro: `${config.label}の整理、手伝うね！`,
          questions: [],
        },
      },
      {
        role: "user",
        answer: {
          messageId: "m0",
          answers: [],
          customInput: initialText,
        },
      },
    ]);

    setInitialInputSubmitted(true);
    setIsStreaming(true);

    // 少し待ってから次の質問を表示
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", message: followUpMessages[0] },
      ]);
      setIsStreaming(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --- チャット部分のロジック ---
  const currentAIMessage = mockMessages[currentMessageIndex];
  const isLastMessage =
    mockMessages.length > 0 && currentMessageIndex >= mockMessages.length - 1;
  const hasQuestions = currentAIMessage?.questions?.length > 0;

  const hasValidAnswer = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return false;
    return answer.selectedIds.length > 0 || answer.customInput.trim() !== "";
  };

  const allQuestionsAnswered =
    !hasQuestions ||
    currentAIMessage.questions.every((q) => hasValidAnswer(q.id));

  const canSubmit = hasQuestions && allQuestionsAnswered;

  const handleOptionChange = (questionId: string, selectedIds: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedIds,
        customInput: prev[questionId]?.customInput || "",
      },
    }));
  };

  const handleCustomInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedIds: prev[questionId]?.selectedIds || [],
        customInput: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const questionAnswers: QuestionAnswer[] = currentAIMessage.questions
      .filter((q) => hasValidAnswer(q.id))
      .map((q) => ({
        questionId: q.id,
        selectedOptionIds: answers[q.id]?.selectedIds || [],
        customInput: answers[q.id]?.customInput?.trim() || undefined,
      }));

    const userAnswer: ChatMessage = {
      role: "user",
      answer: {
        messageId: currentAIMessage.id,
        answers: questionAnswers,
      },
    };

    setMessages((prev) => [...prev, userAnswer]);
    setAnswers({});

    if (isLastMessage) {
      // 最後の質問 → 結果ページへ遷移
      setIsStreaming(true);
      setTimeout(() => {
        router.push(`/result?type=${type}`);
      }, 500);
    } else {
      setIsStreaming(true);
      setTimeout(() => {
        const nextIndex = currentMessageIndex + 1;
        setCurrentMessageIndex(nextIndex);
        setMessages((prev) => [
          ...prev,
          { role: "ai", message: mockMessages[nextIndex] },
        ]);
        setIsStreaming(false);
      }, 600);
    }
  };

  const getAnswerDisplay = (chatMessage: ChatMessage) => {
    if (chatMessage.role !== "user") return "";
    const { answers: ans, customInput } = chatMessage.answer;

    const lines: string[] = [];

    ans.forEach((a) => {
      const question = mockMessages
        .flatMap((m) => m.questions)
        .find((q) => q.id === a.questionId);
      if (!question) return;

      const parts: string[] = [];
      const labels = a.selectedOptionIds
        .map((id) => question.options.find((o) => o.id === id)?.label)
        .filter(Boolean);
      if (labels.length > 0) {
        parts.push(labels.join("、"));
      }
      if (a.customInput) {
        parts.push(a.customInput);
      }
      if (parts.length > 0) {
        lines.push(parts.join(" + "));
      }
    });

    if (customInput) {
      lines.push(customInput);
    }

    return lines.join("\n");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-stone-500 hover:text-stone-700"
          >
            ← やめる
          </button>
          <h1 className="font-bold text-stone-800">
            🤖 {config.label}を整理中
          </h1>
          <div className="w-16" />
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="max-w-2xl mx-auto space-y-4">
          {!initialInputSubmitted ? (
            <InitialInputForm
              fields={config.fields}
              onSubmit={handleInitialSubmit}
            />
          ) : (
            /* チャット履歴 */
            <>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.role === "ai" ? (
                    <div className="space-y-3">
                      {msg.message.intro && (
                        <AIMessageBubble content={msg.message.intro} />
                      )}
                    </div>
                  ) : (
                    <UserMessageBubble content={getAnswerDisplay(msg)} />
                  )}
                </div>
              ))}

              {isStreaming && (
                <AIMessageBubble content="..." isStreaming={true} />
              )}
            </>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 入力エリア（初期入力後のみ） */}
      {initialInputSubmitted && (
        <div className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
          <div className="max-w-2xl mx-auto space-y-3">
            {!isStreaming &&
              hasQuestions &&
              currentAIMessage.questions.map((q) => (
                <Card key={q.id} className="space-y-2">
                  <p className="text-stone-700 font-medium text-sm">
                    {q.content}
                    {q.multiSelect && (
                      <span className="text-stone-400 ml-2">（複数OK）</span>
                    )}
                  </p>
                  <ChoiceChips
                    options={q.options}
                    selectedIds={answers[q.id]?.selectedIds || []}
                    onChange={(ids) => handleOptionChange(q.id, ids)}
                    multiSelect={q.multiSelect}
                  />
                  <Input
                    value={answers[q.id]?.customInput || ""}
                    onChange={(e) =>
                      handleCustomInputChange(q.id, e.target.value)
                    }
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
        </div>
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

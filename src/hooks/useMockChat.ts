import { useState, useCallback, useMemo } from "react";
import type { AIMessage, ChatMessage, QuestionAnswer } from "@/types";

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

type UseMockChatReturn = {
  /** チャットメッセージ履歴 */
  messages: ChatMessage[];
  /** 現在表示中の AI メッセージ */
  currentAIMessage: AIMessage | undefined;
  /** ストリーミング中か */
  isStreaming: boolean;
  /** 最後の質問か */
  isLastMessage: boolean;
  /** 質問があるか */
  hasQuestions: boolean;
  /** 初期入力を送信 */
  submitInitialInput: (label: string, initialText: string) => void;
  /** 回答を送信 */
  submitAnswer: (questionAnswers: QuestionAnswer[]) => void;
  /** 回答のテキスト表示を取得 */
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
};

type UseMockChatOptions = {
  onComplete: () => void;
};

/**
 * モックのチャットフローを管理するフック
 * Phase 5 で実際の API 連携に置き換え予定
 */
export function useMockChat({ onComplete }: UseMockChatOptions): UseMockChatReturn {
  const [mockMessages, setMockMessages] = useState<AIMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const currentAIMessage = mockMessages[currentMessageIndex];
  const isLastMessage = mockMessages.length > 0 && currentMessageIndex >= mockMessages.length - 1;
  const hasQuestions = (currentAIMessage?.questions?.length ?? 0) > 0;

  const submitInitialInput = useCallback((label: string, initialText: string) => {
    const followUpMessages = createFollowUpMessages();
    setMockMessages(followUpMessages);

    // AI の挨拶 + ユーザーの入力
    setMessages([
      {
        role: "ai",
        message: {
          id: "m0",
          intro: `${label}の整理、手伝うね！`,
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

    setIsStreaming(true);

    // 少し待ってから次の質問を表示
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", message: followUpMessages[0] }]);
      setIsStreaming(false);
    }, 800);
  }, []);

  const submitAnswer = useCallback(
    (questionAnswers: QuestionAnswer[]) => {
      if (!currentAIMessage) return;

      const userAnswer: ChatMessage = {
        role: "user",
        answer: {
          messageId: currentAIMessage.id,
          answers: questionAnswers,
        },
      };

      setMessages((prev) => [...prev, userAnswer]);

      if (isLastMessage) {
        // 最後の質問 → 結果ページへ遷移
        setIsStreaming(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      } else {
        setIsStreaming(true);
        setTimeout(() => {
          const nextIndex = currentMessageIndex + 1;
          setCurrentMessageIndex(nextIndex);
          setMessages((prev) => [...prev, { role: "ai", message: mockMessages[nextIndex] }]);
          setIsStreaming(false);
        }, 600);
      }
    },
    [currentAIMessage, currentMessageIndex, isLastMessage, mockMessages, onComplete]
  );

  const getAnswerDisplay = useCallback(
    (chatMessage: ChatMessage): string => {
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
    },
    [mockMessages]
  );

  return useMemo(
    () => ({
      messages,
      currentAIMessage,
      isStreaming,
      isLastMessage,
      hasQuestions,
      submitInitialInput,
      submitAnswer,
      getAnswerDisplay,
    }),
    [
      messages,
      currentAIMessage,
      isStreaming,
      isLastMessage,
      hasQuestions,
      submitInitialInput,
      submitAnswer,
      getAnswerDisplay,
    ]
  );
}

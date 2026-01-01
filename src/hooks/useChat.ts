"use client";

import { useState, useCallback, useMemo } from "react";
import { generateFirstQuestion, generateNextQuestion, generateOutput } from "@/actions/chat";
import type {
  HorensoType,
  AIMessage,
  ChatMessage,
  QuestionAnswer,
  StructuredOutput,
} from "@/types";

/** sessionStorage に保存するデータのキー */
const STORAGE_KEY = "horenso-chat-data";

type ChatData = {
  type: HorensoType;
  messages: ChatMessage[];
  output?: StructuredOutput;
};

/** sessionStorage にデータを保存 */
function saveChatData(data: ChatData) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** sessionStorage からデータを読み込み */
export function loadChatData(): ChatData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ChatData;
  } catch {
    return null;
  }
}

/** sessionStorage のデータをクリア */
export function clearChatData() {
  sessionStorage.removeItem(STORAGE_KEY);
}

type UseChatReturn = {
  /** チャットメッセージ履歴 */
  messages: ChatMessage[];
  /** 現在表示中の AI メッセージ */
  currentAIMessage: AIMessage | undefined;
  /** ローディング中か */
  isLoading: boolean;
  /** 質問があるか */
  hasQuestions: boolean;
  /** 整理完了可能か（AI が十分な情報と判断） */
  isReady: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 初期入力を送信 */
  submitInitialInput: (initialInput: {
    topic: string;
    recipient: string;
    detail: string;
  }) => Promise<void>;
  /** 回答を送信 */
  submitAnswer: (questionAnswers: QuestionAnswer[], customInput?: string) => Promise<void>;
  /** 出力を生成して完了 */
  completeAndGenerate: () => Promise<void>;
  /** 回答のテキスト表示を取得 */
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
};

type UseChatOptions = {
  type: HorensoType;
  onComplete: () => void;
};

/**
 * Claude API を使ったチャットフローを管理するフック
 */
export function useChat({ type, onComplete }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState<AIMessage | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasQuestions = (currentAIMessage?.questions?.length ?? 0) > 0;

  // 初期入力を送信
  const submitInitialInput = useCallback(
    async (initialInput: { topic: string; recipient: string; detail: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const aiMessage = await generateFirstQuestion(type, initialInput);

        // AI の最初のメッセージを追加
        const newMessages: ChatMessage[] = [{ role: "ai", message: aiMessage }];
        setMessages(newMessages);
        setCurrentAIMessage(aiMessage);
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate first question:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [type]
  );

  // 回答を送信
  const submitAnswer = useCallback(
    async (questionAnswers: QuestionAnswer[], customInput?: string) => {
      if (!currentAIMessage) return;

      setIsLoading(true);
      setError(null);

      // ユーザーの回答をメッセージに追加
      const userMessage: ChatMessage = {
        role: "user",
        answer: {
          messageId: currentAIMessage.id,
          answers: questionAnswers,
          customInput,
        },
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      try {
        const result = await generateNextQuestion(type, updatedMessages);

        // AI のメッセージを追加
        const newMessages: ChatMessage[] = [
          ...updatedMessages,
          { role: "ai", message: result.message },
        ];
        setMessages(newMessages);
        setCurrentAIMessage(result.message);
        setIsReady(result.ready);
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate next question:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentAIMessage, messages, type]
  );

  // 出力を生成して完了
  const completeAndGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const output = await generateOutput(type, messages);

      // データを sessionStorage に保存
      saveChatData({ type, messages, output });

      onComplete();
    } catch (err) {
      setError("出力の生成に失敗しました。もう一度お試しください。");
      console.error("Failed to generate output:", err);
    } finally {
      setIsLoading(false);
    }
  }, [type, messages, onComplete]);

  // 回答のテキスト表示を取得
  const getAnswerDisplay = useCallback(
    (chatMessage: ChatMessage): string => {
      if (chatMessage.role !== "user") return "";
      const { answers: ans, customInput } = chatMessage.answer;

      const lines: string[] = [];

      // 全メッセージから質問を探す
      const allQuestions = messages
        .filter((m): m is ChatMessage & { role: "ai" } => m.role === "ai")
        .flatMap((m) => m.message.questions);

      ans.forEach((a) => {
        const question = allQuestions.find((q) => q.id === a.questionId);
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
    [messages]
  );

  return useMemo(
    () => ({
      messages,
      currentAIMessage,
      isLoading,
      hasQuestions,
      isReady,
      error,
      submitInitialInput,
      submitAnswer,
      completeAndGenerate,
      getAnswerDisplay,
    }),
    [
      messages,
      currentAIMessage,
      isLoading,
      hasQuestions,
      isReady,
      error,
      submitInitialInput,
      submitAnswer,
      completeAndGenerate,
      getAnswerDisplay,
    ]
  );
}

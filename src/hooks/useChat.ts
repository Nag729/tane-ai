"use client";

import { useState, useCallback, useMemo } from "react";
import { fetchInitialQuestion, fetchNextQuestion, QuestionResponse } from "@/lib/chatApi";
import { saveChatData } from "@/lib/chatStorage";
import { useThinking } from "./useThinking";
import type {
  MeetingType,
  AIMessage,
  AIChatMessage,
  ChatMessage,
  QuestionAnswer,
  ChatPhase,
  InitialInputData,
} from "@/types";

export { saveChatData, loadChatData, clearChatData } from "@/lib/chatStorage";

function createAIMessage(result: QuestionResponse): AIMessage {
  return { id: `msg-${Date.now()}`, intro: result.intro, questions: result.questions };
}

function buildAnswerDisplayText(chatMessage: ChatMessage, allMessages: ChatMessage[]): string {
  if (chatMessage.role !== "user") return "";
  const { messageId, answers } = chatMessage.answer;

  // messageId に対応する AI メッセージの質問だけを検索
  const targetAIMessage = allMessages.find(
    (m): m is AIChatMessage => m.role === "ai" && m.message.id === messageId
  );

  if (!targetAIMessage) return "";

  const questions = targetAIMessage.message.questions;

  return answers
    .flatMap((a) => {
      const question = questions.find((q) => q.id === a.questionId);
      if (!question) return [];
      const labels = a.selectedOptionIds
        .map((id) => question.options.find((o) => o.id === id)?.label)
        .filter(Boolean)
        .join("、");
      const text = [labels, a.customInput].filter(Boolean).join(" + ");
      return text ? [text] : [];
    })
    .join("\n");
}

type UseChatOptions = { type: MeetingType; onComplete: () => void };

export function useChat({ type, onComplete }: UseChatOptions) {
  // フェーズ管理（FSM）
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState<AIMessage>();
  const [error, setError] = useState<string | null>(null);
  const thinking = useThinking();

  const hasQuestions = (currentAIMessage?.questions?.length ?? 0) > 0;

  /**
   * 初期入力を送信して最初の質問を取得
   * idle → thinking → answering
   */
  const submitInitialInput = useCallback(
    async (initialInput: InitialInputData) => {
      setPhase("thinking");
      setError(null);
      thinking.resetThinking();
      try {
        const result = await fetchInitialQuestion(
          type,
          initialInput,
          thinking.createThinkingCallbacks()
        );
        const aiMessage = createAIMessage(result);
        setMessages([{ role: "ai", message: aiMessage }]);
        setCurrentAIMessage(aiMessage);
        setPhase(result.ready ? "ready" : "answering");
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate first question:", err);
        setPhase("idle");
      }
    },
    [type, thinking]
  );

  /**
   * 質問への回答を送信して次の質問を取得
   * answering → thinking → answering | ready
   */
  const submitAnswer = useCallback(
    async (questionAnswers: QuestionAnswer[]) => {
      if (!currentAIMessage) return;
      setPhase("thinking");
      setError(null);
      thinking.resetThinking();
      const userMessage: ChatMessage = {
        role: "user",
        answer: { messageId: currentAIMessage.id, answers: questionAnswers },
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      try {
        const result = await fetchNextQuestion(
          type,
          updatedMessages,
          thinking.createThinkingCallbacks()
        );
        const aiMessage = createAIMessage(result);
        setMessages([...updatedMessages, { role: "ai", message: aiMessage }]);
        setCurrentAIMessage(aiMessage);
        setPhase(result.ready ? "ready" : "answering");
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate next question:", err);
        setPhase("answering");
      }
    },
    [currentAIMessage, messages, type, thinking]
  );

  /**
   * チャットを完了してストレージに保存、結果ページへ遷移
   * ready → /result へ遷移（出力生成は /result で行う）
   */
  const completeChat = useCallback(() => {
    // メッセージを保存（出力は /result で生成）
    saveChatData({ type, messages });
    onComplete();
  }, [type, messages, onComplete]);

  const getAnswerDisplay = useCallback(
    (chatMessage: ChatMessage): string => buildAnswerDisplayText(chatMessage, messages),
    [messages]
  );

  return useMemo(
    () => ({
      // フェーズ
      phase,
      // 状態
      messages,
      currentAIMessage,
      hasQuestions,
      error,
      // Thinking 状態
      thinkingContent: thinking.thinkingContent,
      // アクション
      submitInitialInput,
      submitAnswer,
      completeChat,
      getAnswerDisplay,
      // 便利なフラグ（後方互換用）
      isLoading: phase === "thinking",
      isReady: phase === "ready",
    }),
    [
      phase,
      messages,
      currentAIMessage,
      hasQuestions,
      error,
      thinking.thinkingContent,
      submitInitialInput,
      submitAnswer,
      completeChat,
      getAnswerDisplay,
    ]
  );
}

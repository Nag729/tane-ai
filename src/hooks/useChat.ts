"use client";

import { useState, useCallback, useMemo } from "react";
import {
  fetchInitialQuestion,
  fetchNextQuestion,
  fetchOutput,
  QuestionResponse,
} from "@/lib/chatApi";
import { saveChatData } from "@/lib/chatStorage";
import { useThinking } from "./useThinking";
import type { HorensoType, AIMessage, ChatMessage, QuestionAnswer } from "@/types";

export { saveChatData, loadChatData, clearChatData } from "@/lib/chatStorage";

function createAIMessage(result: QuestionResponse): AIMessage {
  return { id: `msg-${Date.now()}`, intro: result.intro, questions: result.questions };
}

function buildAnswerDisplayText(chatMessage: ChatMessage, allMessages: ChatMessage[]): string {
  if (chatMessage.role !== "user") return "";
  const { answers: ans, customInput } = chatMessage.answer;
  const allQuestions = allMessages
    .filter((m): m is ChatMessage & { role: "ai" } => m.role === "ai")
    .flatMap((m) => m.message.questions);

  const lines = ans
    .map((a) => {
      const question = allQuestions.find((q) => q.id === a.questionId);
      if (!question) return null;
      const labels = a.selectedOptionIds
        .map((id) => question.options.find((o) => o.id === id)?.label)
        .filter(Boolean);
      const parts = [
        ...(labels.length > 0 ? [labels.join("、")] : []),
        ...(a.customInput ? [a.customInput] : []),
      ];
      return parts.length > 0 ? parts.join(" + ") : null;
    })
    .filter(Boolean);

  if (customInput) lines.push(customInput);
  return lines.join("\n");
}

type UseChatOptions = { type: HorensoType; onComplete: () => void };

// eslint-disable-next-line max-lines-per-function
export function useChat({ type, onComplete }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState<AIMessage>();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingOutput, setStreamingOutput] = useState("");
  const thinking = useThinking();

  const hasQuestions = (currentAIMessage?.questions?.length ?? 0) > 0;

  const submitInitialInput = useCallback(
    async (initialInput: { topic: string; recipient: string; detail: string }) => {
      setIsLoading(true);
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
        setIsReady(result.ready);
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate first question:", err);
      } finally {
        setIsLoading(false);
        thinking.stopThinking();
      }
    },
    [type, thinking]
  );

  const submitAnswer = useCallback(
    async (questionAnswers: QuestionAnswer[], customInput?: string) => {
      if (!currentAIMessage) return;
      setIsLoading(true);
      setError(null);
      const userMessage: ChatMessage = {
        role: "user",
        answer: { messageId: currentAIMessage.id, answers: questionAnswers, customInput },
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      try {
        const result = await fetchNextQuestion(type, updatedMessages);
        const aiMessage = createAIMessage(result);
        setMessages([...updatedMessages, { role: "ai", message: aiMessage }]);
        setCurrentAIMessage(aiMessage);
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

  const completeAndGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStreamingOutput("");
    thinking.resetThinking();
    try {
      const fullText = await fetchOutput(type, messages, {
        ...thinking.createThinkingCallbacks(),
        onTextAccumulated: setStreamingOutput,
      });
      saveChatData({ type, messages, output: { content: fullText } });
      onComplete();
    } catch (err) {
      setError("出力の生成に失敗しました。もう一度お試しください。");
      console.error("Failed to generate output:", err);
    } finally {
      setIsLoading(false);
      thinking.stopThinking();
    }
  }, [type, messages, onComplete, thinking]);

  const getAnswerDisplay = useCallback(
    (chatMessage: ChatMessage): string => buildAnswerDisplayText(chatMessage, messages),
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
      streamingOutput,
      isThinking: thinking.isThinking,
      thinkingContent: thinking.thinkingContent,
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
      streamingOutput,
      thinking.isThinking,
      thinking.thinkingContent,
      submitInitialInput,
      submitAnswer,
      completeAndGenerate,
      getAnswerDisplay,
    ]
  );
}

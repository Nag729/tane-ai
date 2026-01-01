"use client";

import { useState, useCallback, useMemo } from "react";
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

/** SSE ストリームを読み取るユーティリティ */
async function readSSEStream<T>(
  response: Response,
  onProgress?: () => void,
  onText?: (text: string) => void
): Promise<T> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let result: T | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));

        if (data.type === "progress") {
          onProgress?.();
        } else if (data.type === "text") {
          onText?.(data.text);
        } else if (data.type === "complete") {
          result = data.data as T;
        } else if (data.type === "done") {
          // ストリーム完了
        } else if (data.type === "error") {
          throw new Error(data.error);
        }
      }
    }
  }

  if (result === undefined) {
    throw new Error("No result received");
  }
  return result;
}

type QuestionResponse = {
  intro: string;
  questions: {
    id: string;
    content: string;
    options: { id: string; label: string }[];
    multiSelect: boolean;
    customInputPlaceholder?: string;
  }[];
  ready: boolean;
};

type UseChatReturn = {
  messages: ChatMessage[];
  currentAIMessage: AIMessage | undefined;
  isLoading: boolean;
  hasQuestions: boolean;
  isReady: boolean;
  error: string | null;
  streamingOutput: string;
  submitInitialInput: (initialInput: {
    topic: string;
    recipient: string;
    detail: string;
  }) => Promise<void>;
  submitAnswer: (questionAnswers: QuestionAnswer[], customInput?: string) => Promise<void>;
  completeAndGenerate: () => Promise<void>;
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
};

type UseChatOptions = {
  type: HorensoType;
  onComplete: () => void;
};

export function useChat({ type, onComplete }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAIMessage, setCurrentAIMessage] = useState<AIMessage | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingOutput, setStreamingOutput] = useState("");

  const hasQuestions = (currentAIMessage?.questions?.length ?? 0) > 0;

  const submitInitialInput = useCallback(
    async (initialInput: { topic: string; recipient: string; detail: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, initialInput }),
        });

        const result = await readSSEStream<QuestionResponse>(response);

        const aiMessage: AIMessage = {
          id: `msg-${Date.now()}`,
          intro: result.intro,
          questions: result.questions,
        };

        const newMessages: ChatMessage[] = [{ role: "ai", message: aiMessage }];
        setMessages(newMessages);
        setCurrentAIMessage(aiMessage);
        setIsReady(result.ready);
      } catch (err) {
        setError("エラーが発生しました。もう一度お試しください。");
        console.error("Failed to generate first question:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [type]
  );

  const submitAnswer = useCallback(
    async (questionAnswers: QuestionAnswer[], customInput?: string) => {
      if (!currentAIMessage) return;

      setIsLoading(true);
      setError(null);

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
        const response = await fetch("/api/chat/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, messages: updatedMessages }),
        });

        const result = await readSSEStream<QuestionResponse>(response);

        const aiMessage: AIMessage = {
          id: `msg-${Date.now()}`,
          intro: result.intro,
          questions: result.questions,
        };

        const newMessages: ChatMessage[] = [...updatedMessages, { role: "ai", message: aiMessage }];
        setMessages(newMessages);
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

    try {
      const response = await fetch("/api/chat/output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, messages }),
      });

      // ストリーミングでテキストを受け取る
      let fullText = "";
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "text") {
              fullText += data.text;
              setStreamingOutput(fullText);
            } else if (data.type === "error") {
              throw new Error(data.error);
            }
          }
        }
      }

      const output: StructuredOutput = { content: fullText };
      saveChatData({ type, messages, output });
      onComplete();
    } catch (err) {
      setError("出力の生成に失敗しました。もう一度お試しください。");
      console.error("Failed to generate output:", err);
    } finally {
      setIsLoading(false);
    }
  }, [type, messages, onComplete]);

  const getAnswerDisplay = useCallback(
    (chatMessage: ChatMessage): string => {
      if (chatMessage.role !== "user") return "";
      const { answers: ans, customInput } = chatMessage.answer;

      const lines: string[] = [];

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
      streamingOutput,
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
      submitInitialInput,
      submitAnswer,
      completeAndGenerate,
      getAnswerDisplay,
    ]
  );
}

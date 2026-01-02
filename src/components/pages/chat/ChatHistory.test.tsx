import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatHistory } from "./ChatHistory";
import type { ChatMessage } from "@/types";

const mockMessages: ChatMessage[] = [
  {
    role: "ai",
    message: {
      id: "msg-1",
      intro: "こんにちは！報告の整理をお手伝いします。",
      questions: [],
    },
  },
  {
    role: "user",
    answer: {
      messageId: "msg-1",
      answers: [],
      customInput: "プロジェクトの進捗報告です",
    },
  },
  {
    role: "ai",
    message: {
      id: "msg-2",
      intro: "なるほど！もう少し詳しく教えてください。",
      questions: [],
    },
  },
];

describe("ChatHistory", () => {
  // Given: AI メッセージがある
  // When: レンダリングする
  // Then: AI の intro が表示される
  it("should render AI messages", () => {
    render(<ChatHistory messages={mockMessages} getAnswerDisplay={() => ""} />);
    expect(screen.getByText("こんにちは！報告の整理をお手伝いします。")).toBeInTheDocument();
    expect(screen.getByText("なるほど！もう少し詳しく教えてください。")).toBeInTheDocument();
  });

  // Given: ユーザーメッセージがある
  // When: レンダリングする
  // Then: getAnswerDisplay の結果が表示される
  it("should render user messages using getAnswerDisplay", () => {
    const getAnswerDisplay = vi.fn().mockReturnValue("テスト回答");
    render(<ChatHistory messages={mockMessages} getAnswerDisplay={getAnswerDisplay} />);
    expect(screen.getByText("テスト回答")).toBeInTheDocument();
    expect(getAnswerDisplay).toHaveBeenCalled();
  });

  // Given: メッセージが空
  // When: レンダリングする
  // Then: 何も表示されない
  it("should render nothing when messages is empty", () => {
    const { container } = render(<ChatHistory messages={[]} getAnswerDisplay={() => ""} />);
    expect(container.textContent).toBe("");
  });
});

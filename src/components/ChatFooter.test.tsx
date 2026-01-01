import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatFooter } from "./ChatFooter";
import type { AIMessage } from "@/types";

const mockAIMessage: AIMessage = {
  id: "msg-1",
  intro: "質問です",
  questions: [
    {
      id: "q-1",
      content: "どちらを選びますか？",
      options: [
        { id: "opt-1", label: "選択肢A" },
        { id: "opt-2", label: "選択肢B" },
      ],
      multiSelect: false,
    },
  ],
};

const defaultProps = {
  isReady: false,
  isLoading: false,
  hasQuestions: false,
  currentAIMessage: undefined,
  answers: {},
  canSubmit: false,
  onComplete: vi.fn(),
  onSubmit: vi.fn(),
  onOptionChange: vi.fn(),
  onCustomInputChange: vi.fn(),
  onKeyDown: vi.fn(),
};

describe("ChatFooter", () => {
  // Given: isReady が true かつ isLoading が false
  // When: レンダリングする
  // Then: 完了ボタンが表示される
  it("should show complete button when isReady is true and not loading", () => {
    render(<ChatFooter {...defaultProps} isReady={true} />);
    expect(screen.getByText(/整理完了！結果を見る/)).toBeInTheDocument();
  });

  // Given: isReady が true かつ isLoading が true
  // When: レンダリングする
  // Then: 完了ボタンが表示されない
  it("should not show complete button when loading", () => {
    render(<ChatFooter {...defaultProps} isReady={true} isLoading={true} />);
    expect(screen.queryByText(/整理完了！結果を見る/)).not.toBeInTheDocument();
  });

  // Given: hasQuestions が true かつ currentAIMessage がある
  // When: レンダリングする
  // Then: QuestionCard が表示される
  it("should show questions when hasQuestions is true", () => {
    render(
      <ChatFooter {...defaultProps} hasQuestions={true} currentAIMessage={mockAIMessage} answers={{ "q-1": { selectedIds: [], customInput: "" } }} />
    );
    expect(screen.getByText("どちらを選びますか？")).toBeInTheDocument();
    expect(screen.getByText("選択肢A")).toBeInTheDocument();
    expect(screen.getByText("選択肢B")).toBeInTheDocument();
  });

  // Given: canSubmit が true かつ isLoading が false
  // When: レンダリングする
  // Then: 送信ボタンが表示される
  it("should show submit button when canSubmit is true", () => {
    render(<ChatFooter {...defaultProps} canSubmit={true} />);
    expect(screen.getByText("次へ →")).toBeInTheDocument();
  });

  // Given: isLoading が true
  // When: レンダリングする
  // Then: ローディングテキストが表示される
  it("should show loading indicator when isLoading is true", () => {
    render(<ChatFooter {...defaultProps} isLoading={true} />);
    expect(screen.getByText("思考中...")).toBeInTheDocument();
  });

  // Given: 完了ボタンがある
  // When: クリックする
  // Then: onComplete が呼ばれる
  it("should call onComplete when complete button is clicked", async () => {
    const user = userEvent.setup();
    const handleComplete = vi.fn();
    render(<ChatFooter {...defaultProps} isReady={true} onComplete={handleComplete} />);

    await user.click(screen.getByText(/整理完了！結果を見る/));
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  // Given: 送信ボタンがある
  // When: クリックする
  // Then: onSubmit が呼ばれる
  it("should call onSubmit when submit button is clicked", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ChatFooter {...defaultProps} canSubmit={true} onSubmit={handleSubmit} />);

    await user.click(screen.getByText("次へ →"));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  // Given: isReady が true かつ hasQuestions が true
  // When: レンダリングする
  // Then: 質問は表示されない（完了ボタンのみ）
  it("should not show questions when isReady is true", () => {
    render(
      <ChatFooter
        {...defaultProps}
        isReady={true}
        hasQuestions={true}
        currentAIMessage={mockAIMessage}
        answers={{ "q-1": { selectedIds: [], customInput: "" } }}
      />
    );
    expect(screen.queryByText("どちらを選びますか？")).not.toBeInTheDocument();
    expect(screen.getByText(/整理完了！結果を見る/)).toBeInTheDocument();
  });

  // Given: isReady が true かつ canSubmit が true
  // When: レンダリングする
  // Then: 送信ボタンは表示されない（完了ボタンのみ）
  it("should not show submit button when isReady is true", () => {
    render(<ChatFooter {...defaultProps} isReady={true} canSubmit={true} />);
    expect(screen.queryByText("次へ →")).not.toBeInTheDocument();
    expect(screen.getByText(/整理完了！結果を見る/)).toBeInTheDocument();
  });
});

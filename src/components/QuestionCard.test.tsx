import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "@/types";

const mockQuestion: Question = {
  id: "q1",
  content: "報告の目的は何ですか？",
  options: [
    { id: "opt1", label: "進捗共有" },
    { id: "opt2", label: "問題報告" },
    { id: "opt3", label: "完了報告" },
  ],
  multiSelect: false,
  customInputPlaceholder: "その他の目的があれば入力",
};

const multiSelectQuestion: Question = {
  ...mockQuestion,
  id: "q2",
  content: "関係者を選んでください",
  multiSelect: true,
};

describe("QuestionCard", () => {
  // Given: 質問データがある
  // When: レンダリングする
  // Then: 質問内容が表示される
  it("should render question content", () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.getByText("報告の目的は何ですか？")).toBeInTheDocument();
  });

  // Given: 選択肢がある
  // When: レンダリングする
  // Then: 全ての選択肢が表示される
  it("should render all options", () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.getByText("進捗共有")).toBeInTheDocument();
    expect(screen.getByText("問題報告")).toBeInTheDocument();
    expect(screen.getByText("完了報告")).toBeInTheDocument();
  });

  // Given: multiSelect が true
  // When: レンダリングする
  // Then: 「複数OK」と表示される
  it("should show multi-select indicator when multiSelect is true", () => {
    render(
      <QuestionCard
        question={multiSelectQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.getByText("（複数OK）")).toBeInTheDocument();
  });

  // Given: multiSelect が false
  // When: レンダリングする
  // Then: 「複数OK」と表示されない
  it("should not show multi-select indicator when multiSelect is false", () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.queryByText("（複数OK）")).not.toBeInTheDocument();
  });

  // Given: 選択肢をクリックする
  // When: onOptionChange が呼ばれる
  // Then: 選択したIDが渡される
  it("should call onOptionChange when option is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={handleChange}
        onCustomInputChange={() => {}}
      />
    );

    await user.click(screen.getByText("進捗共有"));
    expect(handleChange).toHaveBeenCalledWith(["opt1"]);
  });

  // Given: カスタム入力欄がある
  // When: 入力する
  // Then: onCustomInputChange が呼ばれる
  it("should call onCustomInputChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("その他の目的があれば入力");
    await user.type(input, "テスト");
    expect(handleChange).toHaveBeenCalled();
  });

  // Given: プレースホルダーが設定されている
  // When: レンダリングする
  // Then: プレースホルダーが表示される
  it("should display custom placeholder", () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("その他の目的があれば入力")).toBeInTheDocument();
  });

  // Given: プレースホルダーが未設定
  // When: レンダリングする
  // Then: デフォルトプレースホルダーが表示される
  it("should display default placeholder when not set", () => {
    const questionWithoutPlaceholder = { ...mockQuestion, customInputPlaceholder: undefined };

    render(
      <QuestionCard
        question={questionWithoutPlaceholder}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("自由に入力...")).toBeInTheDocument();
  });

  // Given: onKeyDown が設定されている
  // When: Enterキーを押す
  // Then: onKeyDown が呼ばれる
  it("should call onKeyDown when key is pressed", async () => {
    const user = userEvent.setup();
    const handleKeyDown = vi.fn();

    render(
      <QuestionCard
        question={mockQuestion}
        selectedIds={[]}
        customInput=""
        onOptionChange={() => {}}
        onCustomInputChange={() => {}}
        onKeyDown={handleKeyDown}
      />
    );

    const input = screen.getByPlaceholderText("その他の目的があれば入力");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(handleKeyDown).toHaveBeenCalled();
  });
});

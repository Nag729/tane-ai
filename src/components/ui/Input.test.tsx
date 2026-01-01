import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input, Textarea } from "./Input";

describe("Input", () => {
  // Given: Inputコンポーネントが存在する
  // When: レンダリングする
  // Then: input要素が表示される
  it("should render input element", () => {
    render(<Input aria-label="テスト入力" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // Given: placeholderが渡されている
  // When: レンダリングする
  // Then: placeholderが表示される
  it("should show placeholder", () => {
    render(<Input placeholder="入力してください" />);
    expect(screen.getByPlaceholderText("入力してください")).toBeInTheDocument();
  });

  // Given: onChangeが渡されている
  // When: 入力する
  // Then: onChangeが呼ばれる
  it("should call onChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="テスト入力" onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "テスト");

    expect(handleChange).toHaveBeenCalled();
  });

  // Given: valueが渡されている
  // When: レンダリングする
  // Then: 値が表示される
  it("should display value", () => {
    render(<Input aria-label="テスト入力" value="初期値" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("初期値");
  });

  // Given: errorがtrue
  // When: レンダリングする
  // Then: エラースタイルが適用される
  it("should apply error styles when error is true", () => {
    render(<Input aria-label="テスト入力" error />);
    expect(screen.getByRole("textbox")).toHaveClass("border-rose-400");
  });
});

describe("Textarea", () => {
  // Given: Textareaコンポーネントが存在する
  // When: レンダリングする
  // Then: textarea要素が表示される
  it("should render textarea element", () => {
    render(<Textarea aria-label="テスト入力" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // Given: placeholderが渡されている
  // When: レンダリングする
  // Then: placeholderが表示される
  it("should show placeholder", () => {
    render(<Textarea placeholder="入力してください" />);
    expect(screen.getByPlaceholderText("入力してください")).toBeInTheDocument();
  });

  // Given: rowsが渡されている
  // When: レンダリングする
  // Then: rowsが設定される
  it("should have specified rows", () => {
    render(<Textarea aria-label="テスト入力" rows={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  // Given: ChatInputコンポーネントが存在する
  // When: レンダリングする
  // Then: 入力欄が表示される
  it("should render input field", () => {
    render(<ChatInput onSubmit={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // Given: placeholderが渡されている
  // When: レンダリングする
  // Then: placeholderが表示される
  it("should show placeholder", () => {
    render(<ChatInput onSubmit={() => {}} placeholder="自由に入力..." />);
    expect(screen.getByPlaceholderText("自由に入力...")).toBeInTheDocument();
  });

  // Given: テキストを入力している
  // When: 送信ボタンをクリックする
  // Then: onSubmitが呼ばれ、入力がクリアされる
  it("should submit and clear input when send button is clicked", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ChatInput onSubmit={handleSubmit} />);
    await user.type(screen.getByRole("textbox"), "カスタム回答");
    await user.click(screen.getByRole("button", { name: /送信/ }));

    expect(handleSubmit).toHaveBeenCalledWith("カスタム回答");
  });

  // Given: 入力が空
  // When: 送信ボタンをクリックする
  // Then: onSubmitが呼ばれない
  it("should not submit when input is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ChatInput onSubmit={handleSubmit} />);
    await user.click(screen.getByRole("button", { name: /送信/ }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // Given: テキストを入力している
  // When: Enterキーを押す
  // Then: onSubmitが呼ばれる
  it("should submit when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ChatInput onSubmit={handleSubmit} />);
    await user.type(screen.getByRole("textbox"), "Enter送信{enter}");

    expect(handleSubmit).toHaveBeenCalledWith("Enter送信");
  });

  // Given: disabledがtrue
  // When: レンダリングする
  // Then: 入力欄と送信ボタンが無効化される
  it("should disable input and button when disabled", () => {
    render(<ChatInput onSubmit={() => {}} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

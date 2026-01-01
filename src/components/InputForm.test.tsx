import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InputForm } from "./InputForm";

describe("InputForm", () => {
  // Given: InputFormコンポーネントが存在する
  // When: レンダリングする
  // Then: 目的・相手・背景の3つの入力欄がある
  it("should render three input fields", () => {
    render(<InputForm onSubmit={() => {}} />);

    expect(screen.getByLabelText(/目的/)).toBeInTheDocument();
    expect(screen.getByLabelText(/相手/)).toBeInTheDocument();
    expect(screen.getByLabelText(/背景/)).toBeInTheDocument();
  });

  // Given: 全ての入力欄が空
  // When: 送信ボタンをクリックする
  // Then: onSubmitが呼ばれない
  it("should not submit when all fields are empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<InputForm onSubmit={handleSubmit} />);
    await user.click(screen.getByRole("button", { name: /始める/ }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // Given: 一部の入力欄だけ入力されている
  // When: 送信ボタンをクリックする
  // Then: onSubmitが呼ばれない
  it("should not submit when some fields are empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<InputForm onSubmit={handleSubmit} />);
    await user.type(screen.getByLabelText(/目的/), "テスト目的");
    await user.click(screen.getByRole("button", { name: /始める/ }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // Given: 全ての入力欄が入力されている
  // When: 送信ボタンをクリックする
  // Then: onSubmitが入力値で呼ばれる
  it("should submit when all fields are filled", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<InputForm onSubmit={handleSubmit} />);
    await user.type(screen.getByLabelText(/目的/), "プロジェクトの進捗報告");
    await user.type(screen.getByLabelText(/相手/), "マネージャーの田中さん");
    await user.type(screen.getByLabelText(/背景/), "週次定例の前に");

    await user.click(screen.getByRole("button", { name: /始める/ }));

    expect(handleSubmit).toHaveBeenCalledWith({
      purpose: "プロジェクトの進捗報告",
      recipient: "マネージャーの田中さん",
      background: "週次定例の前に",
    });
  });

  // Given: isLoadingがtrue
  // When: レンダリングする
  // Then: ボタンが無効化され、テキストが変わる
  it("should disable submit button when loading", () => {
    render(<InputForm onSubmit={() => {}} isLoading />);

    const button = screen.getByRole("button", { name: /準備中/ });
    expect(button).toBeDisabled();
  });

  // Given: 相手の入力欄
  // When: placeholderを確認する
  // Then: 前提知識レベルのヒントがある
  it("should have placeholder with knowledge level hint for recipient", () => {
    render(<InputForm onSubmit={() => {}} />);

    const recipientInput = screen.getByLabelText(/相手/);
    expect(recipientInput).toHaveAttribute("placeholder", expect.stringContaining("技術"));
  });
});

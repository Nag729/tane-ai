import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FeedbackForm } from "./FeedbackForm";

describe("FeedbackForm", () => {
  // Given: FeedbackFormコンポーネントが存在する
  // When: レンダリングする
  // Then: フィードバック入力欄が表示される
  it("should render feedback input", () => {
    render(<FeedbackForm onSubmit={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // Given: フィードバックを入力している
  // When: 再生成ボタンをクリックする
  // Then: onSubmitが呼ばれる
  it("should call onSubmit with feedback when submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FeedbackForm onSubmit={handleSubmit} />);
    await user.type(screen.getByRole("textbox"), "もう少し詳しく");
    await user.click(screen.getByRole("button", { name: /再生成/ }));

    expect(handleSubmit).toHaveBeenCalledWith("もう少し詳しく");
  });

  // Given: 入力が空
  // When: 再生成ボタンをクリックする
  // Then: onSubmitが呼ばれない
  it("should not submit when input is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FeedbackForm onSubmit={handleSubmit} />);
    await user.click(screen.getByRole("button", { name: /再生成/ }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // Given: isLoadingがtrue
  // When: レンダリングする
  // Then: ボタンが無効化される
  it("should disable button when loading", () => {
    render(<FeedbackForm onSubmit={() => {}} isLoading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Given: placeholderが設定されている
  // When: レンダリングする
  // Then: placeholderが表示される
  it("should show placeholder", () => {
    render(<FeedbackForm onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/修正点/)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatHeader } from "./ChatHeader";

describe("ChatHeader", () => {
  // Given: ラベルがある
  // When: レンダリングする
  // Then: ラベルが表示される
  it("should render label", () => {
    render(<ChatHeader label="意思判断" onBack={() => {}} />);
    expect(screen.getByText(/意思判断会議を準備中/)).toBeInTheDocument();
  });

  // Given: 種アイコンがある
  // When: レンダリングする
  // Then: アイコンが表示される
  it("should render seed icon", () => {
    render(<ChatHeader label="共有" onBack={() => {}} />);
    expect(screen.getByText(/🌱/)).toBeInTheDocument();
  });

  // Given: 戻るボタンがある
  // When: クリックする
  // Then: onBack が呼ばれる
  it("should call onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const handleBack = vi.fn();
    render(<ChatHeader label="ディスカッション" onBack={handleBack} />);

    await user.click(screen.getByText("← やめる"));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});

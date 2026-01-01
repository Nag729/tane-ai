import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CardButton } from "./CardButton";

describe("CardButton", () => {
  // Given: CardButtonコンポーネントが存在する
  // When: レンダリングする
  // Then: 子要素が表示される
  it("should render children", () => {
    render(<CardButton>カード内容</CardButton>);
    expect(screen.getByRole("button", { name: "カード内容" })).toBeInTheDocument();
  });

  // Given: onClickが渡されている
  // When: クリックする
  // Then: onClickが呼ばれる
  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<CardButton onClick={handleClick}>クリック</CardButton>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Given: selectedがtrue
  // When: レンダリングする
  // Then: 選択状態のスタイルが適用される
  it("should apply selected styles when selected", () => {
    render(<CardButton selected>選択中</CardButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-emerald-500");
  });

  // Given: disabledがtrue
  // When: クリックする
  // Then: onClickが呼ばれない
  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <CardButton onClick={handleClick} disabled>
        無効
      </CardButton>
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });
});

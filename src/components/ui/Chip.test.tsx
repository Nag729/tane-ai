import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  // Given: Chipコンポーネントが存在する
  // When: レンダリングする
  // Then: ラベルが表示される
  it("should render label", () => {
    render(<Chip label="選択肢A" />);
    expect(screen.getByText("選択肢A")).toBeInTheDocument();
  });

  // Given: onClickが渡されている
  // When: クリックする
  // Then: onClickが呼ばれる
  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Chip label="選択肢" onClick={handleClick} />);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Given: selectedがtrue
  // When: レンダリングする
  // Then: 選択状態のスタイルが適用される
  it("should apply selected styles when selected", () => {
    render(<Chip label="選択中" selected />);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass("bg-emerald-500");
    expect(chip).toHaveClass("text-white");
  });

  // Given: selectedがfalse（デフォルト）
  // When: レンダリングする
  // Then: 非選択状態のスタイルが適用される
  it("should apply unselected styles when not selected", () => {
    render(<Chip label="未選択" />);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass("bg-stone-100");
    expect(chip).not.toHaveClass("text-white");
  });

  // Given: disabledがtrue
  // When: クリックする
  // Then: onClickが呼ばれない
  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Chip label="無効" onClick={handleClick} disabled />);
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // Given: Chipがレンダリングされる
  // When: スタイルを確認する
  // Then: 角丸がある
  it("should have rounded style", () => {
    render(<Chip label="角丸" />);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass("rounded-full");
  });
});

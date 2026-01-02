import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TypeSelector } from "./TypeSelector";

describe("TypeSelector", () => {
  // Given: TypeSelectorコンポーネントが存在する
  // When: レンダリングする
  // Then: 意思判断・共有・ディスカッションの3つが表示される
  it("should render three type options", () => {
    render(<TypeSelector onSelect={() => {}} />);

    expect(screen.getByRole("button", { name: /意思判断/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /共有/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ディスカッション/ })).toBeInTheDocument();
  });

  // Given: onSelectが渡されている
  // When: 意思判断をクリックする
  // Then: onSelectが"decision"で呼ばれる
  it("should call onSelect with 'decision' when decision is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /意思判断/ }));

    expect(handleSelect).toHaveBeenCalledWith("decision");
  });

  // Given: onSelectが渡されている
  // When: 共有をクリックする
  // Then: onSelectが"share"で呼ばれる
  it("should call onSelect with 'share' when share is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /共有/ }));

    expect(handleSelect).toHaveBeenCalledWith("share");
  });

  // Given: onSelectが渡されている
  // When: ディスカッションをクリックする
  // Then: onSelectが"discussion"で呼ばれる
  it("should call onSelect with 'discussion' when discussion is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /ディスカッション/ }));

    expect(handleSelect).toHaveBeenCalledWith("discussion");
  });

  // Given: selectedが"decision"
  // When: レンダリングする
  // Then: 意思判断が選択状態で表示される
  it("should show decision as selected when selected is decision", () => {
    render(<TypeSelector selected="decision" onSelect={() => {}} />);

    const decisionButton = screen.getByRole("button", { name: /意思判断/ });
    expect(decisionButton).toHaveClass("bg-emerald-500");
  });

  // Given: selectedがundefined
  // When: レンダリングする
  // Then: どれも選択されていない
  it("should show no selection when selected is undefined", () => {
    render(<TypeSelector onSelect={() => {}} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toHaveClass("bg-emerald-500");
    });
  });
});

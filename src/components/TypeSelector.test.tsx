import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TypeSelector } from "./TypeSelector";

describe("TypeSelector", () => {
  // Given: TypeSelectorコンポーネントが存在する
  // When: レンダリングする
  // Then: 報告・連絡・相談の3つが表示される
  it("should render three type options", () => {
    render(<TypeSelector onSelect={() => {}} />);

    expect(screen.getByRole("button", { name: /報告/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /連絡/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /相談/ })).toBeInTheDocument();
  });

  // Given: onSelectが渡されている
  // When: 報告をクリックする
  // Then: onSelectが"report"で呼ばれる
  it("should call onSelect with 'report' when report is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /報告/ }));

    expect(handleSelect).toHaveBeenCalledWith("report");
  });

  // Given: onSelectが渡されている
  // When: 連絡をクリックする
  // Then: onSelectが"contact"で呼ばれる
  it("should call onSelect with 'contact' when contact is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /連絡/ }));

    expect(handleSelect).toHaveBeenCalledWith("contact");
  });

  // Given: onSelectが渡されている
  // When: 相談をクリックする
  // Then: onSelectが"consult"で呼ばれる
  it("should call onSelect with 'consult' when consult is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TypeSelector onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: /相談/ }));

    expect(handleSelect).toHaveBeenCalledWith("consult");
  });

  // Given: selectedが"report"
  // When: レンダリングする
  // Then: 報告が選択状態で表示される
  it("should show report as selected when selected is report", () => {
    render(<TypeSelector selected="report" onSelect={() => {}} />);

    const reportButton = screen.getByRole("button", { name: /報告/ });
    expect(reportButton).toHaveClass("bg-emerald-500");
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

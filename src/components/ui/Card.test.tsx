import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  // Given: Cardコンポーネントが存在する
  // When: children を渡してレンダリングする
  // Then: 子要素が表示される
  it("should render children", () => {
    render(<Card>カード内容</Card>);
    expect(screen.getByText("カード内容")).toBeInTheDocument();
  });

  // Given: classNameが渡されている
  // When: レンダリングする
  // Then: カスタムクラスが追加される
  it("should apply custom className", () => {
    render(
      <Card className="custom-class" data-testid="card">
        内容
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
  });

  // Given: Cardがレンダリングされる
  // When: スタイルを確認する
  // Then: 角丸と影とボーダーがある
  it("should have rounded corners, shadow, and border", () => {
    render(<Card data-testid="card">内容</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("rounded-2xl");
    expect(card).toHaveClass("shadow-lg");
    expect(card).toHaveClass("border-stone-200");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  // Given: Buttonコンポーネントが存在する
  // When: レンダリングする
  // Then: 子要素が表示される
  it("should render children", () => {
    render(<Button>クリック</Button>);
    expect(screen.getByRole("button", { name: "クリック" })).toBeInTheDocument();
  });

  // Given: onClickが渡されている
  // When: クリックする
  // Then: onClickが呼ばれる
  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>クリック</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Given: disabledがtrue
  // When: クリックする
  // Then: onClickが呼ばれない
  it("should not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        クリック
      </Button>
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // Given: disabledがtrue
  // When: レンダリングする
  // Then: disabled属性がある
  it("should have disabled attribute when disabled", () => {
    render(<Button disabled>クリック</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Given: variant="primary"
  // When: レンダリングする
  // Then: プライマリスタイルが適用される
  it("should apply primary variant styles", () => {
    render(<Button variant="primary">プライマリ</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-emerald-500");
  });

  // Given: variant="secondary"
  // When: レンダリングする
  // Then: セカンダリスタイルが適用される
  it("should apply secondary variant styles", () => {
    render(<Button variant="secondary">セカンダリ</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-amber-50");
  });

  // Given: classNameが渡されている
  // When: レンダリングする
  // Then: カスタムクラスが追加される
  it("should apply custom className", () => {
    render(<Button className="custom-class">カスタム</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResultHeader } from "./ResultHeader";

describe("ResultHeader", () => {
  // Given: コンポーネントがある
  // When: レンダリングする
  // Then: タイトルが表示される
  it("should render title", () => {
    render(<ResultHeader />);
    expect(screen.getByText("整理完了！")).toBeInTheDocument();
  });

  // Given: コンポーネントがある
  // When: レンダリングする
  // Then: 説明文が表示される
  it("should render description", () => {
    render(<ResultHeader />);
    expect(screen.getByText("内容をコピーして使ってね")).toBeInTheDocument();
  });

  // Given: コンポーネントがある
  // When: レンダリングする
  // Then: 絵文字が表示される
  it("should render emoji", () => {
    render(<ResultHeader />);
    expect(screen.getByText("🎉")).toBeInTheDocument();
  });
});

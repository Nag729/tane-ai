import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RegeneratingCard } from "./RegeneratingCard";

describe("RegeneratingCard", () => {
  // Given: コンテンツがある
  // When: レンダリングする
  // Then: タイトルが表示される
  it("should render title", () => {
    render(<RegeneratingCard content="テスト" />);
    expect(screen.getByText(/再生成中/)).toBeInTheDocument();
  });

  // Given: コンテンツがある
  // When: レンダリングする
  // Then: コンテンツが表示される
  it("should render content", () => {
    render(<RegeneratingCard content="再生成中のコンテンツ" />);
    expect(screen.getByText("再生成中のコンテンツ")).toBeInTheDocument();
  });

  // Given: コンテンツがある
  // When: レンダリングする
  // Then: ストリーミングカーソルが表示される
  it("should show streaming cursor", () => {
    render(<RegeneratingCard content="テスト" />);
    expect(screen.getByText("▊")).toBeInTheDocument();
  });
});

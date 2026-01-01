import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StreamingText } from "./StreamingText";

describe("StreamingText", () => {
  // Given: 内容がなくストリーミング中でもない
  // When: レンダリングする
  // Then: 何も表示されない
  it("should not render when no content and not streaming", () => {
    const { container } = render(<StreamingText content="" />);
    expect(container.firstChild).toBeNull();
  });

  // Given: テキスト内容がある
  // When: レンダリングする
  // Then: 内容が表示される
  it("should display content", () => {
    render(<StreamingText content="テスト内容です" />);
    expect(screen.getByText("テスト内容です")).toBeInTheDocument();
  });

  // Given: ストリーミング中
  // When: レンダリングする
  // Then: カーソルが表示される
  it("should show cursor when streaming", () => {
    render(<StreamingText content="ストリーミング中" isStreaming />);
    expect(screen.getByText("▊")).toBeInTheDocument();
  });

  // Given: ストリーミング完了
  // When: レンダリングする
  // Then: カーソルが表示されない
  it("should not show cursor when not streaming", () => {
    render(<StreamingText content="完了" isStreaming={false} />);
    expect(screen.queryByText("▊")).not.toBeInTheDocument();
  });

  // Given: Markdown内容
  // When: markdown=true でレンダリング
  // Then: Markdownとしてレンダリングされる
  it("should render markdown content", () => {
    render(<StreamingText content="# タイトル" markdown />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("タイトル");
  });

  // Given: Markdown内容
  // When: markdown=false でレンダリング
  // Then: プレーンテキストとして表示される
  it("should render as plain text when markdown is false", () => {
    render(<StreamingText content="# タイトル" markdown={false} />);
    expect(screen.getByText("# タイトル")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  // Given: カスタムクラス名
  // When: レンダリングする
  // Then: クラス名が適用される
  it("should apply custom className", () => {
    const { container } = render(<StreamingText content="テスト" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StreamingOutputCard } from "./StreamingOutputCard";

describe("StreamingOutputCard", () => {
  // Given: content が空
  // When: レンダリングする
  // Then: 何も表示されない
  it("should render nothing when content is empty", () => {
    const { container } = render(<StreamingOutputCard content="" isStreaming={false} />);
    expect(container.firstChild).toBeNull();
  });

  // Given: content がある
  // When: レンダリングする
  // Then: コンテンツが表示される
  it("should render content when provided", () => {
    render(<StreamingOutputCard content="テスト出力内容" isStreaming={false} />);
    expect(screen.getByText("テスト出力内容")).toBeInTheDocument();
  });

  // Given: コンポーネントがある
  // When: レンダリングする
  // Then: タイトルが表示される
  it("should render title", () => {
    render(<StreamingOutputCard content="コンテンツ" isStreaming={false} />);
    expect(screen.getByText(/出力を生成中/)).toBeInTheDocument();
  });

  // Given: isStreaming が true
  // When: レンダリングする
  // Then: ストリーミングカーソルが表示される
  it("should show streaming cursor when isStreaming is true", () => {
    render(<StreamingOutputCard content="ストリーミング中..." isStreaming={true} />);
    expect(screen.getByText("▊")).toBeInTheDocument();
  });

  // Given: isStreaming が false
  // When: レンダリングする
  // Then: ストリーミングカーソルが表示されない
  it("should not show streaming cursor when isStreaming is false", () => {
    render(<StreamingOutputCard content="完了" isStreaming={false} />);
    expect(screen.queryByText("▊")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AIMessageBubble } from "./AIMessageBubble";

describe("AIMessageBubble", () => {
  // Given: AIMessageBubbleコンポーネントが存在する
  // When: contentを渡してレンダリングする
  // Then: メッセージが表示される
  it("should render message content", () => {
    render(<AIMessageBubble content="これはAIからの質問です" />);
    expect(screen.getByText("これはAIからの質問です")).toBeInTheDocument();
  });

  // Given: AIのアバター/アイコンがある
  // When: レンダリングする
  // Then: AIアイコンが表示される
  it("should render AI icon", () => {
    render(<AIMessageBubble content="質問" />);
    expect(screen.getByText("🤖")).toBeInTheDocument();
  });

  // Given: isStreamingがtrue
  // When: レンダリングする
  // Then: ストリーミングインジケータが表示される
  it("should show streaming indicator when streaming", () => {
    render(<AIMessageBubble content="思考中..." isStreaming />);
    expect(screen.getByTestId("streaming-indicator")).toBeInTheDocument();
  });

  // Given: isStreamingがfalse
  // When: レンダリングする
  // Then: ストリーミングインジケータが表示されない
  it("should not show streaming indicator when not streaming", () => {
    render(<AIMessageBubble content="完了しました" />);
    expect(screen.queryByTestId("streaming-indicator")).not.toBeInTheDocument();
  });
});

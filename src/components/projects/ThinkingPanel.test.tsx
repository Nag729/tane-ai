import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ThinkingPanel } from "./ThinkingPanel";

describe("ThinkingPanel", () => {
  // Given: 思考中でなく内容もない
  // When: レンダリングする
  // Then: 何も表示されない
  it("should not render when not thinking and no content", () => {
    const { container } = render(<ThinkingPanel isThinking={false} content="" />);
    expect(container.firstChild).toBeNull();
  });

  // Given: 思考中
  // When: レンダリングする
  // Then: 「思考中...」が表示される
  it("should show thinking indicator when isThinking is true", () => {
    render(<ThinkingPanel isThinking={true} content="" />);
    expect(screen.getByText("思考中...")).toBeInTheDocument();
  });

  // Given: 思考内容がある
  // When: レンダリングする
  // Then: 内容が表示される
  it("should display thinking content", () => {
    render(<ThinkingPanel isThinking={true} content="ユーザーの質問を分析しています" />);
    expect(screen.getByText(/ユーザーの質問を分析しています/)).toBeInTheDocument();
  });

  // Given: 思考完了
  // When: レンダリングする
  // Then: パネルが表示され、内容が見える
  it("should show panel when thinking is done with content", () => {
    render(<ThinkingPanel isThinking={false} content="分析完了しました" />);
    expect(screen.getByText(/分析完了しました/)).toBeInTheDocument();
  });

  // Given: パネルがデフォルトで開いている
  // When: ヘッダーをクリックする
  // Then: パネルが閉じる（max-h クラスが変わる）
  it("should toggle panel when header is clicked", async () => {
    const user = userEvent.setup();
    render(<ThinkingPanel isThinking={true} content="テスト内容" />);

    // コンテンツのラッパーを取得
    const contentWrapper = screen.getByText(/テスト内容/).parentElement?.parentElement?.parentElement;

    // 最初は開いている（max-h-64）
    expect(contentWrapper).toHaveClass("max-h-64");

    // ヘッダーをクリックして閉じる
    await user.click(screen.getByRole("button"));

    // 閉じた状態（max-h-0）
    expect(contentWrapper).toHaveClass("max-h-0");
  });

  // Given: カスタムタイトル
  // When: レンダリングする
  // Then: カスタムタイトルが表示される
  it("should display custom title", () => {
    render(<ThinkingPanel isThinking={true} content="" title="分析中..." />);
    expect(screen.getByText("分析中...")).toBeInTheDocument();
  });

  // Given: 思考中
  // When: レンダリングする
  // Then: カーソルが表示される
  it("should show cursor when thinking", () => {
    render(<ThinkingPanel isThinking={true} content="思考中" />);
    expect(screen.getByText("▊")).toBeInTheDocument();
  });
});

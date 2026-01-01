import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OutputCard } from "./OutputCard";
import type { StructuredOutput } from "@/types";

const mockOutput: StructuredOutput = {
  markdown: "# タイトル\n\n**太字**です",
  plaintext: "タイトル\n\n太字です",
};

describe("OutputCard", () => {
  // Given: OutputCardコンポーネントが存在する
  // When: outputを渡してレンダリングする
  // Then: 出力内容が表示される
  it("should render output content", () => {
    render(<OutputCard output={mockOutput} format="markdown" />);
    expect(screen.getByText(/タイトル/)).toBeInTheDocument();
  });

  // Given: formatがmarkdown
  // When: レンダリングする
  // Then: Markdownとして表示される
  it("should render as markdown when format is markdown", () => {
    render(<OutputCard output={mockOutput} format="markdown" />);
    const strong = screen.getByText("太字");
    expect(strong.tagName).toBe("STRONG");
  });

  // Given: formatがplaintext
  // When: レンダリングする
  // Then: プレーンテキストとして表示される（Markdown構文なし）
  it("should render as plaintext when format is plaintext", () => {
    render(<OutputCard output={mockOutput} format="plaintext" />);
    // プレーンテキストはMarkdown構文（**）を含まない
    expect(screen.getByText(/太字です/)).toBeInTheDocument();
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  // Given: コピーボタンがある
  // When: クリックする
  // Then: 現在のフォーマットの内容がクリップボードにコピーされる
  it("should copy plaintext content to clipboard when copy button is clicked", async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn(() => Promise.resolve());

    vi.stubGlobal("navigator", {
      clipboard: { writeText: mockWriteText },
    });

    render(<OutputCard output={mockOutput} format="plaintext" />);
    await user.click(screen.getByRole("button", { name: /コピー/ }));

    expect(mockWriteText).toHaveBeenCalledWith(mockOutput.plaintext);

    vi.unstubAllGlobals();
  });

  // Given: フォーマット切り替えがある
  // When: 切り替えボタンをクリックする
  // Then: onFormatChangeが呼ばれる
  it("should call onFormatChange when format toggle is clicked", async () => {
    const user = userEvent.setup();
    const handleFormatChange = vi.fn();

    render(
      <OutputCard
        output={mockOutput}
        format="markdown"
        onFormatChange={handleFormatChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /プレーン/ }));
    expect(handleFormatChange).toHaveBeenCalledWith("plaintext");
  });
});

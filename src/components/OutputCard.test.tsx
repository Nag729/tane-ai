import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OutputCard } from "./OutputCard";
import type { StructuredOutput } from "@/types";

const mockOutput: StructuredOutput = {
  content: "# タイトル\n\n**太字**です",
};

describe("OutputCard", () => {
  // Given: OutputCardコンポーネントが存在する
  // When: outputを渡してレンダリングする
  // Then: 出力内容が表示される
  it("should render output content", () => {
    render(<OutputCard output={mockOutput} />);
    expect(screen.getByText(/タイトル/)).toBeInTheDocument();
  });

  // Given: Markdown形式のコンテンツ
  // When: レンダリングする
  // Then: Markdownとして表示される
  it("should render content as markdown", () => {
    render(<OutputCard output={mockOutput} />);
    const strong = screen.getByText("太字");
    expect(strong.tagName).toBe("STRONG");
  });

  // Given: コピーボタンがある
  // When: クリックする
  // Then: 内容がクリップボードにコピーされる
  it("should copy content to clipboard when copy button is clicked", async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn(() => Promise.resolve());

    vi.stubGlobal("navigator", {
      clipboard: { writeText: mockWriteText },
    });

    render(<OutputCard output={mockOutput} />);
    await user.click(screen.getByRole("button", { name: /コピー/ }));

    expect(mockWriteText).toHaveBeenCalledWith(mockOutput.content);

    vi.unstubAllGlobals();
  });
});

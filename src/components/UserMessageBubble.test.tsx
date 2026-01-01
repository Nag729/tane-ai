import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserMessageBubble } from "./UserMessageBubble";

describe("UserMessageBubble", () => {
  it("should render the content", () => {
    // Given
    const content = "テストメッセージ";

    // When
    render(<UserMessageBubble content={content} />);

    // Then
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should preserve whitespace and newlines", () => {
    // Given
    const content = "1行目\n2行目\n3行目";

    // When
    render(<UserMessageBubble content={content} />);

    // Then
    const element = screen.getByText(/1行目/);
    expect(element).toHaveClass("whitespace-pre-wrap");
  });

  it("should be aligned to the right", () => {
    // Given
    const content = "右寄せ";

    // When
    const { container } = render(<UserMessageBubble content={content} />);

    // Then
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "justify-end");
  });
});

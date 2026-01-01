import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InitialInputForm } from "./InitialInputForm";

const defaultFields = {
  topic: {
    label: "何を報告する？",
    placeholder: "例：新機能の開発進捗",
  },
  recipient: {
    label: "誰に？",
    placeholder: "例：開発チームのリーダー山田さん",
  },
  detail: {
    label: "現状は？",
    placeholder: "例：予定より1週間遅れてる",
  },
};

describe("InitialInputForm", () => {
  it("should render all fields with labels and placeholders", () => {
    // Given
    const onSubmit = vi.fn();

    // When
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // Then
    expect(screen.getByText("何を報告する？")).toBeInTheDocument();
    expect(screen.getByText("誰に？")).toBeInTheDocument();
    expect(screen.getByText("現状は？")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：新機能の開発進捗")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：開発チームのリーダー山田さん")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：予定より1週間遅れてる")).toBeInTheDocument();
  });

  it("should disable submit button when fields are empty", () => {
    // Given
    const onSubmit = vi.fn();

    // When
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // Then
    expect(screen.getByRole("button", { name: /始める/i })).toBeDisabled();
  });

  it("should enable submit button when all fields are filled", async () => {
    // Given
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // When
    await user.type(screen.getByPlaceholderText("例：新機能の開発進捗"), "新機能");
    await user.type(screen.getByPlaceholderText("例：開発チームのリーダー山田さん"), "山田さん");
    await user.type(screen.getByPlaceholderText("例：予定より1週間遅れてる"), "順調");

    // Then
    expect(screen.getByRole("button", { name: /始める/i })).toBeEnabled();
  });

  it("should call onSubmit with trimmed values when form is submitted", async () => {
    // Given
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // When
    await user.type(screen.getByPlaceholderText("例：新機能の開発進捗"), "  新機能  ");
    await user.type(
      screen.getByPlaceholderText("例：開発チームのリーダー山田さん"),
      "  山田さん  "
    );
    await user.type(screen.getByPlaceholderText("例：予定より1週間遅れてる"), "  順調  ");
    await user.click(screen.getByRole("button", { name: /始める/i }));

    // Then
    expect(onSubmit).toHaveBeenCalledWith({
      topic: "新機能",
      recipient: "山田さん",
      detail: "順調",
    });
  });

  it("should show loading state when isLoading is true", () => {
    // Given
    const onSubmit = vi.fn();

    // When
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} isLoading={true} />);

    // Then
    expect(screen.getByRole("button", { name: /準備中/i })).toBeDisabled();
  });

  it("should not submit when only whitespace is entered", async () => {
    // Given
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // When
    await user.type(screen.getByPlaceholderText("例：新機能の開発進捗"), "   ");
    await user.type(screen.getByPlaceholderText("例：開発チームのリーダー山田さん"), "   ");
    await user.type(screen.getByPlaceholderText("例：予定より1週間遅れてる"), "   ");

    // Then
    expect(screen.getByRole("button", { name: /始める/i })).toBeDisabled();
  });
});

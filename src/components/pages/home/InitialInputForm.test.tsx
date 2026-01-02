import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InitialInputForm } from "./InitialInputForm";

const defaultFields = {
  topic: {
    label: "何を決める？",
    placeholder: "例：来期の開発言語の選定",
  },
  participant: {
    label: "誰と決める？",
    placeholder: "例：テックリード、アーキテクト、PdM",
  },
  detail: {
    label: "背景は？",
    placeholder: "例：既存のフレームワークが古くなってきた",
  },
};

describe("InitialInputForm", () => {
  it("should render all fields with labels and placeholders", () => {
    // Given
    const onSubmit = vi.fn();

    // When
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // Then
    expect(screen.getByText("何を決める？")).toBeInTheDocument();
    expect(screen.getByText("誰と決める？")).toBeInTheDocument();
    expect(screen.getByText("背景は？")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：来期の開発言語の選定")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：テックリード、アーキテクト、PdM")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例：既存のフレームワークが古くなってきた")).toBeInTheDocument();
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
    await user.type(screen.getByPlaceholderText("例：来期の開発言語の選定"), "技術選定");
    await user.type(screen.getByPlaceholderText("例：テックリード、アーキテクト、PdM"), "テックリード");
    await user.type(screen.getByPlaceholderText("例：既存のフレームワークが古くなってきた"), "移行検討中");

    // Then
    expect(screen.getByRole("button", { name: /始める/i })).toBeEnabled();
  });

  it("should call onSubmit with trimmed values when form is submitted", async () => {
    // Given
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<InitialInputForm fields={defaultFields} onSubmit={onSubmit} />);

    // When
    await user.type(screen.getByPlaceholderText("例：来期の開発言語の選定"), "  技術選定  ");
    await user.type(
      screen.getByPlaceholderText("例：テックリード、アーキテクト、PdM"),
      "  テックリード  "
    );
    await user.type(screen.getByPlaceholderText("例：既存のフレームワークが古くなってきた"), "  移行検討中  ");
    await user.click(screen.getByRole("button", { name: /始める/i }));

    // Then
    expect(onSubmit).toHaveBeenCalledWith({
      topic: "技術選定",
      participant: "テックリード",
      detail: "移行検討中",
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
    await user.type(screen.getByPlaceholderText("例：来期の開発言語の選定"), "   ");
    await user.type(screen.getByPlaceholderText("例：テックリード、アーキテクト、PdM"), "   ");
    await user.type(screen.getByPlaceholderText("例：既存のフレームワークが古くなってきた"), "   ");

    // Then
    expect(screen.getByRole("button", { name: /始める/i })).toBeDisabled();
  });
});

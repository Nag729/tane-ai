import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "./FormField";
import { createRef } from "react";

describe("FormField", () => {
  it("should render label and textarea", () => {
    // Given
    const onChange = vi.fn();

    // When
    render(<FormField label="Test Label" value="" onChange={onChange} />);

    // Then
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should display placeholder", () => {
    // Given
    const onChange = vi.fn();

    // When
    render(<FormField label="Label" value="" onChange={onChange} placeholder="Enter text..." />);

    // Then
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("should display value", () => {
    // Given
    const onChange = vi.fn();

    // When
    render(<FormField label="Label" value="Hello World" onChange={onChange} />);

    // Then
    expect(screen.getByDisplayValue("Hello World")).toBeInTheDocument();
  });

  it("should call onChange when typing", async () => {
    // Given
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FormField label="Label" value="" onChange={onChange} />);

    // When
    await user.type(screen.getByRole("textbox"), "a");

    // Then
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("should apply custom rows", () => {
    // Given
    const onChange = vi.fn();

    // When
    render(<FormField label="Label" value="" onChange={onChange} rows={5} />);

    // Then
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });

  it("should forward ref to textarea", () => {
    // Given
    const onChange = vi.fn();
    const ref = createRef<HTMLTextAreaElement>();

    // When
    render(<FormField ref={ref} label="Label" value="" onChange={onChange} />);

    // Then
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("should default to 2 rows", () => {
    // Given
    const onChange = vi.fn();

    // When
    render(<FormField label="Label" value="" onChange={onChange} />);

    // Then
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "2");
  });
});

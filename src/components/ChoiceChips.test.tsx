import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChoiceChips } from "./ChoiceChips";
import type { QuestionOption } from "@/types";

const mockOptions: QuestionOption[] = [
  { id: "1", label: "選択肢A" },
  { id: "2", label: "選択肢B" },
  { id: "3", label: "選択肢C" },
];

describe("ChoiceChips", () => {
  // Given: ChoiceChipsコンポーネントが存在する
  // When: optionsを渡してレンダリングする
  // Then: 全ての選択肢が表示される
  it("should render all options", () => {
    render(<ChoiceChips options={mockOptions} selectedIds={[]} onChange={() => {}} />);

    expect(screen.getByText("選択肢A")).toBeInTheDocument();
    expect(screen.getByText("選択肢B")).toBeInTheDocument();
    expect(screen.getByText("選択肢C")).toBeInTheDocument();
  });

  // Given: multiSelectがfalse（単一選択モード）
  // When: 選択肢をクリックする
  // Then: その選択肢だけが選択される
  it("should select single option in single select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ChoiceChips
        options={mockOptions}
        selectedIds={[]}
        onChange={handleChange}
        multiSelect={false}
      />
    );

    await user.click(screen.getByText("選択肢A"));
    expect(handleChange).toHaveBeenCalledWith(["1"]);
  });

  // Given: multiSelectがfalseで既に選択がある
  // When: 別の選択肢をクリックする
  // Then: 新しい選択肢だけが選択される
  it("should replace selection in single select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ChoiceChips
        options={mockOptions}
        selectedIds={["1"]}
        onChange={handleChange}
        multiSelect={false}
      />
    );

    await user.click(screen.getByText("選択肢B"));
    expect(handleChange).toHaveBeenCalledWith(["2"]);
  });

  // Given: multiSelectがtrue（複数選択モード）
  // When: 複数の選択肢をクリックする
  // Then: 複数選択される
  it("should allow multiple selections in multi select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ChoiceChips
        options={mockOptions}
        selectedIds={["1"]}
        onChange={handleChange}
        multiSelect={true}
      />
    );

    await user.click(screen.getByText("選択肢B"));
    expect(handleChange).toHaveBeenCalledWith(["1", "2"]);
  });

  // Given: multiSelectがtrueで選択済みの項目がある
  // When: 選択済みの項目をクリックする
  // Then: その項目の選択が解除される
  it("should deselect item when clicking selected item in multi select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ChoiceChips
        options={mockOptions}
        selectedIds={["1", "2"]}
        onChange={handleChange}
        multiSelect={true}
      />
    );

    await user.click(screen.getByText("選択肢A"));
    expect(handleChange).toHaveBeenCalledWith(["2"]);
  });

  // Given: selectedIdsに値がある
  // When: レンダリングする
  // Then: 選択状態が視覚的に分かる
  it("should show selected state visually", () => {
    render(
      <ChoiceChips
        options={mockOptions}
        selectedIds={["1"]}
        onChange={() => {}}
      />
    );

    const selectedChip = screen.getByText("選択肢A").closest("button");
    expect(selectedChip).toHaveClass("bg-emerald-500");
  });
});

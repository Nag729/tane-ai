import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChoiceChips } from "./ChoiceChips";
import type { QuestionOption } from "@/types";

const sampleOptions: QuestionOption[] = [
  { id: "1", label: "技術的な内容" },
  { id: "2", label: "ビジネス寄り" },
  { id: "3", label: "両方含む" },
  { id: "4", label: "その他" },
];

const meta = {
  component: ChoiceChips,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChoiceChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: {
    options: sampleOptions,
    selectedIds: [],
    onChange: () => {},
    multiSelect: false,
  },
  render: function SingleSelectDemo() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <ChoiceChips
        options={sampleOptions}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        multiSelect={false}
      />
    );
  },
};

export const MultiSelect: Story = {
  args: {
    options: sampleOptions,
    selectedIds: [],
    onChange: () => {},
    multiSelect: true,
  },
  render: function MultiSelectDemo() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <ChoiceChips
        options={sampleOptions}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        multiSelect={true}
      />
    );
  },
};

export const WithInitialSelection: Story = {
  args: {
    options: sampleOptions,
    selectedIds: ["1", "3"],
    onChange: () => {},
    multiSelect: true,
  },
};

export const TwoOptions: Story = {
  args: {
    options: [
      { id: "yes", label: "はい" },
      { id: "no", label: "いいえ" },
    ],
    selectedIds: [],
    onChange: () => {},
  },
};

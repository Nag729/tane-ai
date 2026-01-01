import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "選択肢",
  },
};

export const Selected: Story = {
  args: {
    label: "選択中",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "無効",
    disabled: true,
  },
};

export const Interactive: Story = {
  render: function InteractiveChip() {
    const [selected, setSelected] = useState(false);
    return (
      <Chip
        label={selected ? "選択中" : "クリックして選択"}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};

export const MultipleChips: Story = {
  render: function MultipleChipsDemo() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const options = ["選択肢A", "選択肢B", "選択肢C", "選択肢D"];

    const toggleOption = (option: string) => {
      setSelectedIds((prev) =>
        prev.includes(option) ? prev.filter((id) => id !== option) : [...prev, option]
      );
    };

    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selectedIds.includes(option)}
            onClick={() => toggleOption(option)}
          />
        ))}
      </div>
    );
  },
};

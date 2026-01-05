import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SupplementItem } from "./SupplementItem";
import { supplementLabels } from "@/constants";
import type { SupplementLabel } from "@/types";

const meta = {
  component: SupplementItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-125 p-4 bg-amber-50 rounded-xl">
        <Story />
      </div>
    ),
  ],
  args: {
    labels: supplementLabels as unknown as SupplementLabel[],
    selectedLabel: undefined,
    value: "",
    onLabelChange: () => {},
    onValueChange: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof SupplementItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    selectedLabel: undefined,
    value: "",
  },
};

export const WithLabel: Story = {
  args: {
    selectedLabel: "参加者",
    value: "",
  },
};

export const WithValue: Story = {
  args: {
    selectedLabel: "参加者",
    value: "人事、各チームマネージャー",
  },
};

export const NoLabel: Story = {
  args: {
    selectedLabel: undefined,
    value: "予算は確保済み",
  },
};

export const Interactive: Story = {
  args: {
    labels: supplementLabels as unknown as SupplementLabel[],
    selectedLabel: undefined,
    value: "",
    onLabelChange: () => {},
    onValueChange: () => {},
    onRemove: () => {},
  },
  render: function InteractiveRender(args) {
    const [label, setLabel] = useState<SupplementLabel | undefined>(undefined);
    const [value, setValue] = useState("");

    return (
      <SupplementItem
        {...args}
        selectedLabel={label}
        value={value}
        onLabelChange={setLabel}
        onValueChange={setValue}
        onRemove={() => alert("削除がクリックされました")}
      />
    );
  },
};

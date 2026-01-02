import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TypeSelector } from "./TypeSelector";
import type { MeetingType } from "@/types";

const meta = {
  component: TypeSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-150">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: () => {},
  },
};

export const DecisionSelected: Story = {
  args: {
    selected: "decision",
    onSelect: () => {},
  },
};

export const ShareSelected: Story = {
  args: {
    selected: "share",
    onSelect: () => {},
  },
};

export const DiscussionSelected: Story = {
  args: {
    selected: "discussion",
    onSelect: () => {},
  },
};

export const Interactive: Story = {
  args: {
    onSelect: () => {},
  },
  render: function InteractiveTypeSelector() {
    const [selected, setSelected] = useState<MeetingType | undefined>();
    return <TypeSelector selected={selected} onSelect={setSelected} />;
  },
};

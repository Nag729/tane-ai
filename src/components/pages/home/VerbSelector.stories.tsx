import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { VerbSelector } from "./VerbSelector";
import { verbsByType } from "@/constants";

const meta = {
  component: VerbSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    verbs: verbsByType.decision,
    value: "",
    onChange: () => {},
  },
} satisfies Meta<typeof VerbSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    verbs: verbsByType.decision,
    value: "",
  },
};

export const Selected: Story = {
  args: {
    verbs: verbsByType.decision,
    value: "決定する",
  },
};

export const Share: Story = {
  args: {
    verbs: verbsByType.share,
    value: "共有する",
  },
};

export const Discussion: Story = {
  args: {
    verbs: verbsByType.discussion,
    value: "",
  },
};

export const CustomValue: Story = {
  args: {
    verbs: verbsByType.decision,
    value: "カスタム動詞",
  },
};

export const Interactive: Story = {
  args: {
    verbs: verbsByType.decision,
    value: "",
    onChange: () => {},
  },
  render: function InteractiveRender(args) {
    const [value, setValue] = useState("");

    return (
      <div className="flex items-center gap-2">
        <span className="text-stone-600">テーマを</span>
        <VerbSelector {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { ChatInput } from "./ChatInput";

const meta = {
  title: "Components/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (value) => {
      console.log("Submitted:", value);
      alert(`送信: ${value}`);
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onSubmit: () => {},
    placeholder: "「スキップ」「そうじゃなくて...」など自由に入力",
  },
};

export const Disabled: Story = {
  args: {
    onSubmit: () => {},
    disabled: true,
  },
};

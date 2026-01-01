import type { Meta, StoryObj } from "@storybook/react";
import { UserMessageBubble } from "./UserMessageBubble";

const meta = {
  component: UserMessageBubble,
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
} satisfies Meta<typeof UserMessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "新機能の開発進捗を開発チームのリーダー山田さんに報告したい",
  },
};

export const Short: Story = {
  args: {
    content: "今すぐ！",
  },
};

export const MultiLine: Story = {
  args: {
    content: "承認・決裁\n意見がほしい",
  },
};

export const WithCustomInput: Story = {
  args: {
    content: "今週中 + 具体的なスケジュールを相談したい",
  },
};

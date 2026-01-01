import type { Meta, StoryObj } from "@storybook/react";
import { AIMessageBubble } from "./AIMessageBubble";

const meta = {
  title: "Components/AIMessageBubble",
  component: AIMessageBubble,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AIMessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "報告の目的について教えてください。どのような結果を共有したいですか？",
  },
};

export const LongMessage: Story = {
  args: {
    content:
      "なるほど、プロジェクトの進捗報告ですね。\n\nもう少し詳しく教えてください。\n\n• 現在の進捗率はどのくらいですか？\n• 予定通り進んでいますか？\n• 課題や懸念点はありますか？",
  },
};

export const Streaming: Story = {
  args: {
    content: "考え中...",
    isStreaming: true,
  },
};

export const StreamingWithContent: Story = {
  args: {
    content: "報告の目的について教えて",
    isStreaming: true,
  },
};

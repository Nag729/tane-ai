import type { Meta, StoryObj } from "@storybook/react";
import { ChatHistory } from "./ChatHistory";
import type { ChatMessage } from "@/types";

const meta = {
  component: ChatHistory,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto space-y-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: ChatMessage[] = [
  {
    role: "ai",
    message: {
      id: "msg-1",
      intro: "こんにちは！報告の整理をお手伝いします。まず、報告の目的を教えてください。",
      questions: [],
    },
  },
  {
    role: "user",
    answer: {
      messageId: "msg-1",
      answers: [],
      customInput: "プロジェクトの進捗報告です",
    },
  },
  {
    role: "ai",
    message: {
      id: "msg-2",
      intro: "なるほど、プロジェクトの進捗報告ですね！もう少し詳しく教えてください。",
      questions: [],
    },
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    getAnswerDisplay: (msg) => (msg.role === "user" ? msg.answer.customInput || "" : ""),
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    getAnswerDisplay: () => "",
  },
};

export const SingleAIMessage: Story = {
  args: {
    messages: [sampleMessages[0]],
    getAnswerDisplay: () => "",
  },
};

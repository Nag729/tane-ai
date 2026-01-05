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
      questions: [
        {
          id: "q1",
          content: "報告の目的は？",
          options: [{ id: "opt1", label: "プロジェクトの進捗報告" }],
          multiSelect: false,
        },
      ],
    },
  },
  {
    role: "user",
    answer: {
      messageId: "msg-1",
      answers: [{ questionId: "q1", selectedOptionIds: ["opt1"] }],
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
    getAnswerDisplay: (msg) => (msg.role === "user" ? "プロジェクトの進捗報告" : ""),
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

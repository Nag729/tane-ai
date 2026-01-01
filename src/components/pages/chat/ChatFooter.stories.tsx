import type { Meta, StoryObj } from "@storybook/react";
import { ChatFooter } from "./ChatFooter";
import type { AIMessage } from "@/types";

const meta = {
  component: ChatFooter,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-75 relative">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAIMessage: AIMessage = {
  id: "msg-1",
  intro: "質問です",
  questions: [
    {
      id: "q-1",
      content: "プロジェクトの状況はどうですか？",
      options: [
        { id: "opt-1", label: "順調です" },
        { id: "opt-2", label: "少し遅れています" },
        { id: "opt-3", label: "問題があります" },
      ],
      multiSelect: false,
      customInputPlaceholder: "詳細を入力...",
    },
  ],
};

const defaultHandlers = {
  onComplete: () => alert("整理完了"),
  onSubmit: () => alert("送信"),
  onOptionChange: () => {},
  onCustomInputChange: () => {},
  onKeyDown: () => {},
};

export const WithQuestions: Story = {
  args: {
    isReady: false,
    isLoading: false,
    hasQuestions: true,
    currentAIMessage: mockAIMessage,
    answers: { "q-1": { selectedIds: [], customInput: "" } },
    canSubmit: false,
    ...defaultHandlers,
  },
};

export const WithSelectedOption: Story = {
  args: {
    isReady: false,
    isLoading: false,
    hasQuestions: true,
    currentAIMessage: mockAIMessage,
    answers: { "q-1": { selectedIds: ["opt-1"], customInput: "" } },
    canSubmit: true,
    ...defaultHandlers,
  },
};

export const ReadyToComplete: Story = {
  args: {
    isReady: true,
    isLoading: false,
    hasQuestions: false,
    currentAIMessage: undefined,
    answers: {},
    canSubmit: false,
    ...defaultHandlers,
  },
};

export const Loading: Story = {
  args: {
    isReady: false,
    isLoading: true,
    hasQuestions: false,
    currentAIMessage: undefined,
    answers: {},
    canSubmit: false,
    ...defaultHandlers,
  },
};

/** isReady=true のとき、他のフラグに関わらず完了ボタンのみ表示される */
export const ReadyIgnoresOtherFlags: Story = {
  args: {
    isReady: true,
    isLoading: false,
    hasQuestions: true,
    currentAIMessage: mockAIMessage,
    answers: { "q-1": { selectedIds: ["opt-2"], customInput: "来週には追いつきます" } },
    canSubmit: true,
    ...defaultHandlers,
  },
};

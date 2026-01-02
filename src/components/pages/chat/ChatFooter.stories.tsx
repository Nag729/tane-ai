import type { Meta, StoryObj } from "@storybook/react";
import { ChatFooter } from "./ChatFooter";

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

const defaultHandlers = {
  onComplete: () => alert("資料完成"),
  onSubmit: () => alert("送信"),
};

export const CanSubmit: Story = {
  args: {
    isReady: false,
    isLoading: false,
    canSubmit: true,
    ...defaultHandlers,
  },
};

export const CannotSubmit: Story = {
  args: {
    isReady: false,
    isLoading: false,
    canSubmit: false,
    ...defaultHandlers,
  },
};

export const ReadyToComplete: Story = {
  args: {
    isReady: true,
    isLoading: false,
    canSubmit: false,
    ...defaultHandlers,
  },
};

export const Loading: Story = {
  args: {
    isReady: false,
    isLoading: true,
    canSubmit: false,
    ...defaultHandlers,
  },
};

/** isReady=true のとき、完了ボタンのみ表示される */
export const ReadyIgnoresOtherFlags: Story = {
  args: {
    isReady: true,
    isLoading: false,
    canSubmit: true,
    ...defaultHandlers,
  },
};

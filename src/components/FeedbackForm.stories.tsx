import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackForm } from "./FeedbackForm";

const meta = {
  title: "Components/FeedbackForm",
  component: FeedbackForm,
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
} satisfies Meta<typeof FeedbackForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (feedback) => {
      console.log("Feedback:", feedback);
      alert(`再生成リクエスト: ${feedback}`);
    },
  },
};

export const Loading: Story = {
  args: {
    onSubmit: () => {},
    isLoading: true,
  },
};

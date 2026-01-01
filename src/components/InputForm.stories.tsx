import type { Meta, StoryObj } from "@storybook/react";
import { InputForm } from "./InputForm";

const meta = {
  title: "Components/InputForm",
  component: InputForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-125">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
  },
};

export const Loading: Story = {
  args: {
    onSubmit: () => {},
    isLoading: true,
  },
};

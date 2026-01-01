import type { Meta, StoryObj } from "@storybook/react";
import { Input, Textarea } from "./Input";

const inputMeta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default inputMeta;
type Story = StoryObj<typeof inputMeta>;

export const Default: Story = {
  args: {
    placeholder: "入力してください",
  },
};

export const WithValue: Story = {
  args: {
    value: "入力された値",
    onChange: () => {},
  },
};

export const Error: Story = {
  args: {
    placeholder: "エラー状態",
    error: true,
  },
};

export const TextareaStory: StoryObj<typeof Textarea> = {
  render: () => (
    <div className="w-80">
      <Textarea placeholder="複数行の入力..." rows={5} />
    </div>
  ),
  name: "Textarea",
};

export const AllInputs: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input placeholder="通常の入力" />
      <Input placeholder="エラー状態" error />
      <Textarea placeholder="複数行入力..." />
    </div>
  ),
};

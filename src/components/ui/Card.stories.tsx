import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "カードの内容がここに入ります",
  },
};

export const WithTitle: Story = {
  render: () => (
    <Card className="w-80">
      <h2 className="text-xl font-bold mb-2">カードタイトル</h2>
      <p className="text-gray-600">カードの説明文がここに入ります。</p>
    </Card>
  ),
};

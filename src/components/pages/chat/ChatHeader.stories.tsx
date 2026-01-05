import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "./ChatHeader";

const meta = {
  component: ChatHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decision: Story = {
  args: {
    label: "決める会議",
    onBack: () => alert("戻る"),
  },
};

export const Share: Story = {
  args: {
    label: "伝える会議",
    onBack: () => alert("戻る"),
  },
};

export const Discussion: Story = {
  args: {
    label: "話し合う会議",
    onBack: () => alert("戻る"),
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "./ChatHeader";

const meta = {
  title: "Components/ChatHeader",
  component: ChatHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Report: Story = {
  args: {
    label: "報告",
    onBack: () => alert("戻る"),
  },
};

export const Contact: Story = {
  args: {
    label: "連絡",
    onBack: () => alert("戻る"),
  },
};

export const Consult: Story = {
  args: {
    label: "相談",
    onBack: () => alert("戻る"),
  },
};

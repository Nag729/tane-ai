import type { Meta, StoryObj } from "@storybook/react";
import { PageLoading } from "./PageLoading";

const meta: Meta<typeof PageLoading> = {
  component: PageLoading,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PageLoading>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: {
    message: "データを取得中",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { GitHubLink } from "./GitHubLink";

const meta = {
  title: "ui/GitHubLink",
  component: GitHubLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GitHubLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "https://github.com/Nag729/tane-ai",
  },
};

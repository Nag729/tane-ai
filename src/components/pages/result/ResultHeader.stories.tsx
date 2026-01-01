import type { Meta, StoryObj } from "@storybook/react";
import { ResultHeader } from "./ResultHeader";

const meta = {
  component: ResultHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

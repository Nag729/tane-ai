import type { Meta, StoryObj } from "@storybook/react";
import { TypeSelector } from "./TypeSelector";

const meta = {
  component: TypeSelector,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-150">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: () => {},
  },
};

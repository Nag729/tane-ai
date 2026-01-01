import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TypeSelector } from "./TypeSelector";
import type { HorensoType } from "@/types";

const meta = {
  title: "Components/TypeSelector",
  component: TypeSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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

export const ReportSelected: Story = {
  args: {
    selected: "report",
    onSelect: () => {},
  },
};

export const ContactSelected: Story = {
  args: {
    selected: "contact",
    onSelect: () => {},
  },
};

export const ConsultSelected: Story = {
  args: {
    selected: "consult",
    onSelect: () => {},
  },
};

export const Interactive: Story = {
  args: {
    onSelect: () => {},
  },
  render: function InteractiveTypeSelector() {
    const [selected, setSelected] = useState<HorensoType | undefined>();
    return <TypeSelector selected={selected} onSelect={setSelected} />;
  },
};

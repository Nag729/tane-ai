import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CardButton } from "./CardButton";

const meta = {
  component: CardButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="text-xl mb-2">📋 タイトル</div>
        <div className="text-sm text-stone-500">説明文がここに入ります</div>
      </>
    ),
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: (
      <>
        <div className="text-xl mb-2">✅ 選択中</div>
        <div className="text-sm text-emerald-100">このカードが選択されています</div>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="text-xl mb-2">🚫 無効</div>
        <div className="text-sm text-stone-500">クリックできません</div>
      </>
    ),
  },
};

export const Interactive: Story = {
  render: function InteractiveCardButton() {
    const [selected, setSelected] = useState(false);
    return (
      <CardButton selected={selected} onClick={() => setSelected(!selected)}>
        <div className="text-xl mb-2">{selected ? "✅ 選択中" : "👆 クリック"}</div>
        <div className={`text-sm ${selected ? "text-emerald-100" : "text-stone-500"}`}>
          クリックで切り替え
        </div>
      </CardButton>
    );
  },
};

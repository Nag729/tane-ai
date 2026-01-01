import type { Meta, StoryObj } from "@storybook/react";
import { RegeneratingCard } from "./RegeneratingCard";

const meta = {
  component: RegeneratingCard,
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
} satisfies Meta<typeof RegeneratingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "## 報告内容\n\n### 結論\nプロジェクトは予定通り進行しています。",
  },
};

export const LongContent: Story = {
  args: {
    content: `## 報告内容

### 結論
プロジェクトは予定通り進行しています。

### 詳細
- タスクA: 完了
- タスクB: 進行中（80%）
- タスクC: 未着手

### 次のアクション
1. タスクBを今週中に完了させる
2. タスクCの着手準備を行う`,
  },
};

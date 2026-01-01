import type { Meta, StoryObj } from "@storybook/react";
import { OutputCard } from "./OutputCard";
import type { StructuredOutput } from "@/types";

const sampleOutput: StructuredOutput = {
  content: `## 📋 進捗報告

### 概要
プロジェクトAの開発は**予定通り**進行中です。

### 現在の状況
- フロントエンド実装: 80% 完了
- バックエンドAPI: 90% 完了
- テスト: 60% 完了

### 次のアクション
1. 来週中にテストを完了
2. デプロイ準備を開始
3. ドキュメント整備

### 懸念点
特になし。順調に進んでいます。`,
};

const meta = {
  component: OutputCard,
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
} satisfies Meta<typeof OutputCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    output: sampleOutput,
  },
};

export const ShortContent: Story = {
  args: {
    output: {
      content: "簡単な報告です。**問題ありません。**",
    },
  },
};

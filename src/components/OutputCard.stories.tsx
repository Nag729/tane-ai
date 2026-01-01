import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { OutputCard } from "./OutputCard";
import type { StructuredOutput } from "@/types";

const sampleOutput: StructuredOutput = {
  markdown: `## 📋 進捗報告

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
  plaintext: `📋 進捗報告

【概要】
プロジェクトAの開発は予定通り進行中です。

【現在の状況】
・フロントエンド実装: 80% 完了
・バックエンドAPI: 90% 完了
・テスト: 60% 完了

【次のアクション】
1. 来週中にテストを完了
2. デプロイ準備を開始
3. ドキュメント整備

【懸念点】
特になし。順調に進んでいます。`,
};

const meta = {
  title: "Components/OutputCard",
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

export const MarkdownFormat: Story = {
  args: {
    output: sampleOutput,
    format: "markdown",
  },
};

export const PlaintextFormat: Story = {
  args: {
    output: sampleOutput,
    format: "plaintext",
  },
};

export const Interactive: Story = {
  render: function InteractiveOutputCard() {
    const [format, setFormat] = useState<"markdown" | "plaintext">("markdown");
    return (
      <OutputCard
        output={sampleOutput}
        format={format}
        onFormatChange={setFormat}
      />
    );
  },
};

export const ShortContent: Story = {
  args: {
    output: {
      markdown: "簡単な報告です。**問題ありません。**",
      plaintext: "簡単な報告です。問題ありません。",
    },
    format: "markdown",
  },
};

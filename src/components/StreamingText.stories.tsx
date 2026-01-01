import type { Meta, StoryObj } from "@storybook/react";
import { StreamingText } from "./StreamingText";

const meta: Meta<typeof StreamingText> = {
  title: "Components/StreamingText",
  component: StreamingText,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StreamingText>;

export const Default: Story = {
  args: {
    content: "これはテスト用のテキストです。",
    isStreaming: false,
  },
};

export const Streaming: Story = {
  args: {
    content: "ストリーミング中のテキスト...",
    isStreaming: true,
  },
};

export const MarkdownContent: Story = {
  args: {
    content: `# 報告内容

## 概要
今週のスプリントで実装した機能について報告します。

## 詳細
- **ユーザー認証機能**: OAuth2.0を使用した認証フローを実装
- **ダッシュボード**: リアルタイムデータ表示に対応

## 次のアクション
1. コードレビュー対応
2. テスト追加
3. デプロイ準備`,
    isStreaming: false,
    markdown: true,
  },
};

export const MarkdownStreaming: Story = {
  args: {
    content: `# 報告内容

## 概要
今週のスプリントで実装した`,
    isStreaming: true,
    markdown: true,
  },
};

export const PlainText: Story = {
  args: {
    content: `# これは見出しですが
プレーンテキストとして表示されます。

**太字** も *斜体* もそのまま表示されます。`,
    isStreaming: false,
    markdown: false,
  },
};

export const Empty: Story = {
  args: {
    content: "",
    isStreaming: false,
  },
};

export const EmptyButStreaming: Story = {
  args: {
    content: "",
    isStreaming: true,
  },
};

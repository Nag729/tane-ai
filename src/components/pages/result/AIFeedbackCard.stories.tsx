import type { Meta, StoryObj } from "@storybook/react";
import { AIFeedbackCard } from "./AIFeedbackCard";

const meta: Meta<typeof AIFeedbackCard> = {
  title: "pages/result/AIFeedbackCard",
  component: AIFeedbackCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AIFeedbackCard>;

const sampleFeedback = `## レビュー結果

この資料は全体的によくまとまっていますが、いくつか改善点があります。

### 良い点
- 議題が明確に整理されている
- 目的とゴールが具体的

### 改善提案
1. **数値目標の追加**: 具体的なKPIや成功指標を入れると説得力が増します
2. **リスク対策**: 想定されるリスクと対応策を追記することを推奨します
3. **タイムライン**: 実施スケジュールがあると参加者が見通しを持てます

| 項目 | 現状 | 推奨 |
|------|------|------|
| 数値目標 | なし | あり |
| リスク対策 | なし | あり |
`;

export const Default: Story = {
  args: {
    content: sampleFeedback,
    isStreaming: false,
    onApplyFeedback: () => alert("フィードバックを反映します"),
  },
};

export const Streaming: Story = {
  args: {
    content: "レビューを生成中です...\n\n### 現在確認中の項目\n- 議題の明確さ\n- 目的との整合性",
    isStreaming: true,
  },
};

export const WithRegenerating: Story = {
  args: {
    content: sampleFeedback,
    isStreaming: false,
    onApplyFeedback: () => {},
    isRegenerating: true,
  },
};

export const WithoutApplyButton: Story = {
  args: {
    content: sampleFeedback,
    isStreaming: false,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { ThinkingPanel } from "./ThinkingPanel";

const meta: Meta<typeof ThinkingPanel> = {
  component: ThinkingPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThinkingPanel>;

export const Thinking: Story = {
  args: {
    content: `ユーザーの質問を分析しています。

報告の構造を考えると：
1. 結論を最初に述べる
2. 詳細な経緯を説明
3. 次のアクションを提案

この順序で整理すると伝わりやすくなります。`,
    isThinking: true,
  },
};

export const Completed: Story = {
  args: {
    content: `ユーザーの質問を分析しています。

報告の構造を考えると：
1. 結論を最初に述べる
2. 詳細な経緯を説明
3. 次のアクションを提案

この順序で整理すると伝わりやすくなります。`,
    isThinking: false,
  },
};

export const LongContent: Story = {
  args: {
    content: `これは長い思考内容のテストです。

スクロールが正しく機能するかを確認します。

1. 最初の段落
   ここには詳細な分析が入ります。

2. 次の段落
   さらに詳しい検討事項です。

3. 追加の考察
   もう少し深く考えてみましょう。

4. 結論に向けて
   これらの情報をまとめると...

5. 最終的な方針
   このように進めるのがベストです。`,
    isThinking: true,
  },
};

/** contentが空の状態（API応答待ち） */
export const Loading: Story = {
  args: {
    content: "",
    isThinking: true,
  },
};

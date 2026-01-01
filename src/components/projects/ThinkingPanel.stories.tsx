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
    isThinking: true,
    content: "",
  },
};

export const ThinkingWithContent: Story = {
  args: {
    isThinking: true,
    content: `ユーザーの質問を分析しています。

報告の構造を考えると：
1. 結論を最初に述べる
2. 詳細な経緯を説明
3. 次のアクションを提案

この順序で整理すると伝わりやすくなります。`,
  },
};

export const Completed: Story = {
  args: {
    isThinking: false,
    content: `分析が完了しました。

ユーザーは技術的な報告をPdMに向けて作成しようとしています。
技術詳細よりもビジネスインパクトを中心に整理するのがよさそうです。`,
  },
};

export const CustomTitle: Story = {
  args: {
    isThinking: true,
    content: "出力を生成するための最適な構成を検討中...",
    title: "出力を準備中...",
  },
};

export const LongContent: Story = {
  args: {
    isThinking: true,
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
  },
};

export const Empty: Story = {
  args: {
    isThinking: false,
    content: "",
  },
};

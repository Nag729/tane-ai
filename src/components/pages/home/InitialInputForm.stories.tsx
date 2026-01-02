import type { Meta, StoryObj } from "@storybook/react";
import { InitialInputForm } from "./InitialInputForm";

const meta = {
  component: InitialInputForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-125">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InitialInputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decision: Story = {
  args: {
    fields: {
      topic: {
        label: "何を決める？",
        placeholder: "例：来期の開発言語の選定",
      },
      participant: {
        label: "誰と決める？",
        placeholder: "例：テックリード、アーキテクト、PdM",
      },
      detail: {
        label: "背景は？",
        placeholder: "例：既存のフレームワークが古くなってきた。移行先を検討中",
      },
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
  },
};

export const Share: Story = {
  args: {
    fields: {
      topic: {
        label: "何を共有する？",
        placeholder: "例：来月からのリモートワーク制度変更",
      },
      participant: {
        label: "誰に共有する？",
        placeholder: "例：開発チーム全員",
      },
      detail: {
        label: "概要は？",
        placeholder: "例：週3日出社から週2日出社に変更。希望者は申請可",
      },
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
    },
  },
};

export const Discussion: Story = {
  args: {
    fields: {
      topic: {
        label: "何を議論する？",
        placeholder: "例：プロダクトの今後の方向性",
      },
      participant: {
        label: "誰と議論する？",
        placeholder: "例：プロダクトチーム、デザイナー、エンジニア",
      },
      detail: {
        label: "論点は？",
        placeholder: "例：競合が増えてきた。差別化戦略を検討したい",
      },
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
    },
  },
};

export const Loading: Story = {
  args: {
    fields: {
      topic: {
        label: "何を決める？",
        placeholder: "例：来期の開発言語の選定",
      },
      participant: {
        label: "誰と決める？",
        placeholder: "例：テックリード、アーキテクト、PdM",
      },
      detail: {
        label: "背景は？",
        placeholder: "例：既存のフレームワークが古くなってきた",
      },
    },
    onSubmit: () => {},
    isLoading: true,
  },
};

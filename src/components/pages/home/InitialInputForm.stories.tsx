import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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
  args: {
    sampleCases: [],
    onSampleSelect: () => {},
  },
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

const sampleCasesData = [
  {
    id: "hiring",
    label: "採用計画",
    data: {
      topic: "来期の採用計画",
      participant: "人事、各チームマネージャー、経営企画",
      detail:
        "事業拡大で人員が不足。営業とCSで特に負荷が高い。予算は確保済みだが、何人採用するか決めたい",
    },
  },
  {
    id: "release",
    label: "リリース時期",
    data: {
      topic: "新サービスのリリース時期",
      participant: "プロダクトマネージャー、営業、CS、開発",
      detail:
        "機能は8割完成。年度内に出すか、品質を上げて来期にするか迷っている。競合の動きも気になる",
    },
  },
  {
    id: "tool",
    label: "ツール選定",
    data: {
      topic: "プロジェクト管理ツールの選定",
      participant: "マネージャー陣、情シス",
      detail:
        "現状Excelで管理限界。Notion、Asana、Backlogで迷ってる。コストと使いやすさのバランスが重要",
    },
  },
];

export const WithSampleCases: Story = {
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
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
    sampleCases: sampleCasesData.map((s) => ({ id: s.id, label: s.label })),
    onSampleSelect: () => {},
  },
  render: function WithSampleCasesRender(args) {
    const [defaultValues, setDefaultValues] = useState<
      { topic: string; participant: string; detail: string } | undefined
    >();

    const handleSampleSelect = (id: string) => {
      const sample = sampleCasesData.find((s) => s.id === id);
      if (sample) {
        setDefaultValues(sample.data);
      }
    };

    return (
      <InitialInputForm
        {...args}
        defaultValues={defaultValues}
        onSampleSelect={handleSampleSelect}
      />
    );
  },
};

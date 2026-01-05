import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InitialInputForm } from "./InitialInputForm";
import { verbsByType, supplementLabels } from "@/constants";
import type { InitialInputData, SupplementLabel } from "@/types";

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
    typeLabel: "意思決定",
    themePlaceholder: "例：来期の採用計画",
    verbs: verbsByType.decision,
    supplementLabels: supplementLabels as unknown as SupplementLabel[],
    sampleCases: [],
    onSampleSelect: () => {},
    onSubmit: (data) => console.log("Submitted:", data),
  },
} satisfies Meta<typeof InitialInputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decision: Story = {
  args: {
    typeLabel: "意思決定",
    themePlaceholder: "例：来期の採用計画、新サービスのリリース時期...",
    verbs: verbsByType.decision,
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
  },
};

export const Share: Story = {
  args: {
    typeLabel: "情報共有",
    themePlaceholder: "例：新しい勤怠ルール、システム移行のお知らせ...",
    verbs: verbsByType.share,
    onSubmit: (data) => {
      console.log("Submitted:", data);
    },
  },
};

export const Discussion: Story = {
  args: {
    typeLabel: "ディスカッション",
    themePlaceholder: "例：チームの生産性向上、来期の開発方針...",
    verbs: verbsByType.discussion,
    onSubmit: (data) => {
      console.log("Submitted:", data);
    },
  },
};

export const Loading: Story = {
  args: {
    typeLabel: "意思決定",
    themePlaceholder: "例：来期の採用計画",
    verbs: verbsByType.decision,
    onSubmit: () => {},
    isLoading: true,
  },
};

const sampleCasesData: { id: string; label: string; data: InitialInputData }[] = [
  {
    id: "hiring",
    label: "採用計画",
    data: {
      theme: "来期の採用計画",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "人事、各チームマネージャー" },
        { id: "2", label: "背景", value: "事業拡大で人員が不足" },
      ],
    },
  },
  {
    id: "release",
    label: "リリース時期",
    data: {
      theme: "新サービスのリリース時期",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "PM、営業、開発" },
        { id: "2", label: "制約", value: "年度内にローンチしたい" },
      ],
    },
  },
  {
    id: "tool",
    label: "ツール選定",
    data: {
      theme: "プロジェクト管理ツールの選定",
      verb: "選定する",
      supplements: [
        { id: "1", label: "参加者", value: "マネージャー陣、情シス" },
        { id: "2", value: "Notion、Asana、Backlogで迷ってる" },
      ],
    },
  },
];

export const WithSampleCases: Story = {
  args: {
    typeLabel: "意思決定",
    themePlaceholder: "例：来期の採用計画",
    verbs: verbsByType.decision,
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
    sampleCases: sampleCasesData.map((s) => ({ id: s.id, label: s.label })),
    onSampleSelect: () => {},
  },
  render: function WithSampleCasesRender(args) {
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const selectedSample = sampleCasesData.find((s) => s.id === selectedId);

    const handleSampleSelect = (id: string) => {
      setSelectedId(id);
    };

    return (
      <InitialInputForm
        key={selectedId ?? "empty"}
        {...args}
        defaultValues={selectedSample?.data}
        onSampleSelect={handleSampleSelect}
      />
    );
  },
};

export const WithDefaultValues: Story = {
  args: {
    typeLabel: "意思決定",
    themePlaceholder: "例：来期の採用計画",
    verbs: verbsByType.decision,
    defaultValues: {
      theme: "来期の採用計画",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "人事、各チームマネージャー" },
        { id: "2", label: "背景", value: "事業拡大で人員が不足。予算は確保済み" },
      ],
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
  },
};

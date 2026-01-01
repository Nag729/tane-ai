import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "@/types";

const meta = {
  title: "Components/QuestionCard",
  component: QuestionCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleSelectQuestion: Question = {
  id: "q1",
  content: "報告の目的は何ですか？",
  options: [
    { id: "opt1", label: "進捗共有" },
    { id: "opt2", label: "問題報告" },
    { id: "opt3", label: "完了報告" },
  ],
  multiSelect: false,
  customInputPlaceholder: "その他の目的があれば入力",
};

const multiSelectQuestion: Question = {
  id: "q2",
  content: "関係者を選んでください（複数選択可）",
  options: [
    { id: "opt1", label: "上司" },
    { id: "opt2", label: "チームメンバー" },
    { id: "opt3", label: "他部署" },
    { id: "opt4", label: "クライアント" },
  ],
  multiSelect: true,
  customInputPlaceholder: "その他の関係者",
};

export const Default: Story = {
  args: {
    question: singleSelectQuestion,
    selectedIds: [],
    customInput: "",
    onOptionChange: () => {},
    onCustomInputChange: () => {},
  },
};

export const WithSelection: Story = {
  args: {
    question: singleSelectQuestion,
    selectedIds: ["opt1"],
    customInput: "",
    onOptionChange: () => {},
    onCustomInputChange: () => {},
  },
};

export const MultiSelect: Story = {
  args: {
    question: multiSelectQuestion,
    selectedIds: ["opt1", "opt2"],
    customInput: "",
    onOptionChange: () => {},
    onCustomInputChange: () => {},
  },
};

export const WithCustomInput: Story = {
  args: {
    question: singleSelectQuestion,
    selectedIds: ["opt1"],
    customInput: "プロジェクトの節目報告",
    onOptionChange: () => {},
    onCustomInputChange: () => {},
  },
};

// インタラクティブなストーリー
function InteractiveQuestionCard() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  return (
    <QuestionCard
      question={singleSelectQuestion}
      selectedIds={selectedIds}
      customInput={customInput}
      onOptionChange={setSelectedIds}
      onCustomInputChange={setCustomInput}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveQuestionCard />,
  args: {
    question: singleSelectQuestion,
    selectedIds: [],
    customInput: "",
    onOptionChange: () => {},
    onCustomInputChange: () => {},
  },
};

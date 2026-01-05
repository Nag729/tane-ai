import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SupplementList } from "./SupplementList";
import { supplementLabels } from "@/constants";
import type { Supplement, SupplementLabel } from "@/types";

const meta = {
  component: SupplementList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-125 p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    supplements: [],
    labels: supplementLabels as unknown as SupplementLabel[],
    onChange: () => {},
  },
} satisfies Meta<typeof SupplementList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    supplements: [],
  },
};

export const SingleItem: Story = {
  args: {
    supplements: [{ id: "1", label: "参加者", value: "人事、各チームマネージャー" }],
  },
};

export const MultipleItems: Story = {
  args: {
    supplements: [
      { id: "1", label: "参加者", value: "人事、各チームマネージャー" },
      { id: "2", label: "背景", value: "事業拡大で人員が不足" },
      { id: "3", value: "予算は確保済み" },
    ],
  },
};

export const MixedLabels: Story = {
  args: {
    supplements: [
      { id: "1", label: "参加者", value: "プロダクトチーム" },
      { id: "2", label: "制約", value: "年度内に完了" },
      { id: "3", label: "ゴール", value: "方針を決める" },
    ],
  },
};

export const Interactive: Story = {
  args: {
    supplements: [],
    labels: supplementLabels as unknown as SupplementLabel[],
    onChange: () => {},
  },
  render: function InteractiveRender(args) {
    const [supplements, setSupplements] = useState<Supplement[]>([]);

    return (
      <div className="space-y-4">
        <SupplementList {...args} supplements={supplements} onChange={setSupplements} />
        <div className="text-xs text-stone-400 mt-4">
          <pre>{JSON.stringify(supplements, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

export const WithInitialData: Story = {
  args: {
    supplements: [],
    labels: supplementLabels as unknown as SupplementLabel[],
    onChange: () => {},
  },
  render: function WithInitialDataRender(args) {
    const [supplements, setSupplements] = useState<Supplement[]>([
      { id: "1", label: "参加者", value: "人事、マネージャー" },
      { id: "2", label: "背景", value: "人員不足" },
    ]);

    return <SupplementList {...args} supplements={supplements} onChange={setSupplements} />;
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { InitialInputForm } from "./InitialInputForm";

const meta = {
  title: "Components/InitialInputForm",
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

export const Report: Story = {
  args: {
    fields: {
      topic: {
        label: "何を報告する？",
        placeholder: "例：新機能の開発進捗",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：開発チームのリーダー山田さん",
      },
      detail: {
        label: "現状は？",
        placeholder: "例：予定より1週間遅れてる。原因はAPIの仕様変更",
      },
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
      alert(`送信: ${JSON.stringify(data, null, 2)}`);
    },
  },
};

export const Contact: Story = {
  args: {
    fields: {
      topic: {
        label: "何を連絡する？",
        placeholder: "例：来週のミーティング日程変更",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：プロジェクトメンバー全員",
      },
      detail: {
        label: "伝えたい内容は？",
        placeholder: "例：水曜14時から木曜10時に変更したい",
      },
    },
    onSubmit: (data) => {
      console.log("Submitted:", data);
    },
  },
};

export const Consult: Story = {
  args: {
    fields: {
      topic: {
        label: "何を相談する？",
        placeholder: "例：タスクの優先順位の付け方",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：チームリーダーの佐藤さん",
      },
      detail: {
        label: "困っていることは？",
        placeholder: "例：急ぎの依頼が重なって何から手をつけるべきかわからない",
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
        label: "何を報告する？",
        placeholder: "例：新機能の開発進捗",
      },
      recipient: {
        label: "誰に？",
        placeholder: "例：開発チームのリーダー山田さん",
      },
      detail: {
        label: "現状は？",
        placeholder: "例：予定より1週間遅れてる",
      },
    },
    onSubmit: () => {},
    isLoading: true,
  },
};

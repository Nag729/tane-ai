import type { HorensoType } from "@/types";

type FieldConfig = {
  readonly label: string;
  readonly placeholder: string;
};

export type TypeConfigItem = {
  readonly label: string;
  readonly fields: {
    readonly topic: FieldConfig;
    readonly recipient: FieldConfig;
    readonly detail: FieldConfig;
  };
};

/**
 * 報連相の種類ごとの設定
 */
export const typeConfig = {
  report: {
    label: "報告",
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
  },
  contact: {
    label: "連絡",
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
  },
  consult: {
    label: "相談",
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
  },
} as const satisfies Record<HorensoType, TypeConfigItem>;

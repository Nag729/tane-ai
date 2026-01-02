import type { MeetingType } from "@/types";

type FieldConfig = {
  readonly label: string;
  readonly placeholder: string;
};

export type TypeConfigItem = {
  readonly label: string;
  readonly fields: {
    readonly topic: FieldConfig;
    readonly participant: FieldConfig;
    readonly detail: FieldConfig;
  };
};

/**
 * 会議の種類ごとの設定
 */
export const typeConfig = {
  decision: {
    label: "意思判断",
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
  },
  share: {
    label: "共有・通達",
    fields: {
      topic: {
        label: "何を共有する？",
        placeholder: "例：新しいセキュリティポリシーについて",
      },
      participant: {
        label: "誰に共有する？",
        placeholder: "例：開発チーム全員",
      },
      detail: {
        label: "概要は？",
        placeholder: "例：来月からパスワードポリシーが変わる。対応が必要",
      },
    },
  },
  discussion: {
    label: "ディスカッション",
    fields: {
      topic: {
        label: "何を議論する？",
        placeholder: "例：新機能の技術的アプローチ",
      },
      participant: {
        label: "誰と議論する？",
        placeholder: "例：フロントエンド・バックエンドエンジニア",
      },
      detail: {
        label: "論点は？",
        placeholder: "例：REST API vs GraphQL、どちらが適切か意見を出し合いたい",
      },
    },
  },
} as const satisfies Record<MeetingType, TypeConfigItem>;

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
    label: "意思決定",
    fields: {
      topic: {
        label: "何を決める？",
        placeholder: "例：来期の採用計画、新サービスのリリース時期",
      },
      participant: {
        label: "誰と決める？",
        placeholder: "例：マネージャー、チームリーダー、経営陣",
      },
      detail: {
        label: "背景は？",
        placeholder: "例：事業拡大に伴い、人員体制の見直しが必要になった",
      },
    },
  },
  share: {
    label: "情報共有",
    fields: {
      topic: {
        label: "何を共有する？",
        placeholder: "例：新しい勤怠ルール、組織変更のお知らせ",
      },
      participant: {
        label: "誰に共有する？",
        placeholder: "例：チームメンバー全員、関係部署",
      },
      detail: {
        label: "概要は？",
        placeholder: "例：来月からフレックス制度が変わる。申請方法も変更",
      },
    },
  },
  discussion: {
    label: "ディスカッション",
    fields: {
      topic: {
        label: "何を議論する？",
        placeholder: "例：チームの生産性向上、来期の目標設定",
      },
      participant: {
        label: "誰と議論する？",
        placeholder: "例：チームメンバー、関連部署のリーダー",
      },
      detail: {
        label: "論点は？",
        placeholder: "例：残業が増えている。根本原因と対策を話し合いたい",
      },
    },
  },
} as const satisfies Record<MeetingType, TypeConfigItem>;

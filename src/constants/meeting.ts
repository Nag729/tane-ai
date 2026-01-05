import type { MeetingType, SupplementLabel } from "@/types";

export type TypeConfigItem = {
  readonly label: string;
  readonly themePlaceholder: string;
};

/** 会議タイプごとの動詞リスト */
export const verbsByType = {
  decision: ["決定する", "合意する", "承認を得る", "選定する", "方針を決める"],
  share: ["共有する", "報告する", "周知する", "説明する", "伝達する"],
  discussion: ["議論する", "相談する", "ブレストする", "検討する", "意見交換する"],
} as const satisfies Record<MeetingType, readonly string[]>;

/** 補足ラベルの候補 */
export const supplementLabels: readonly SupplementLabel[] = [
  "参加者",
  "背景",
  "制約",
  "期限",
  "ゴール",
];

/**
 * 会議の種類ごとの設定
 */
export const typeConfig = {
  decision: {
    label: "意思決定",
    themePlaceholder: "例：来期の採用計画",
  },
  share: {
    label: "情報共有",
    themePlaceholder: "例：組織変更のお知らせ",
  },
  discussion: {
    label: "ディスカッション",
    themePlaceholder: "例：来期の目標設定",
  },
} as const satisfies Record<MeetingType, TypeConfigItem>;

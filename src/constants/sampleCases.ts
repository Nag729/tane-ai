import type { MeetingType, InitialInputData } from "@/types";

export type SampleCase = {
  id: string;
  label: string;
  type: MeetingType;
  data: InitialInputData;
};

/**
 * サンプル事例データ
 * 初見ユーザーが「こんな感じで使えばいいのか！」と分かるように
 */
export const sampleCases: SampleCase[] = [
  // decision（意思決定）
  {
    id: "hiring",
    label: "採用計画",
    type: "decision",
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
    type: "decision",
    data: {
      topic: "新サービスのリリース時期",
      participant: "プロダクトマネージャー、営業、CS、開発",
      detail:
        "機能は8割完成。年度内に出すか、品質を上げて来期にするか迷っている。競合の動きも気になる",
    },
  },
  {
    id: "office",
    label: "オフィス移転",
    type: "decision",
    data: {
      topic: "オフィス移転先の決定",
      participant: "経営陣、総務、各部門長",
      detail:
        "現オフィスの契約更新が半年後。3候補まで絞った。コスト・アクセス・広さのバランスで決めたい",
    },
  },
  {
    id: "tool",
    label: "ツール選定",
    type: "decision",
    data: {
      topic: "プロジェクト管理ツールの選定",
      participant: "マネージャー陣、情シス",
      detail:
        "現状Excelで管理限界。Notion、Asana、Backlogで迷ってる。コストと使いやすさのバランスが重要",
    },
  },
  {
    id: "pricing",
    label: "価格改定",
    type: "decision",
    data: {
      topic: "サービスの価格改定",
      participant: "経営陣、営業、カスタマーサクセス",
      detail: "原価高騰で利益率が低下。値上げしたいが、顧客離れも心配。どの程度上げるか決めたい",
    },
  },

  // share（情報共有）
  {
    id: "org-change",
    label: "組織変更",
    type: "share",
    data: {
      topic: "4月からの組織変更について",
      participant: "全社員",
      detail: "新規事業部の設立と、それに伴う人員異動。影響を受けるメンバーへの説明が必要",
    },
  },
  {
    id: "remote",
    label: "リモート制度",
    type: "share",
    data: {
      topic: "リモートワーク制度の変更",
      participant: "全社員",
      detail: "週2出社から週3出社に変更。適用は来月から。各自のスケジュール調整をお願いしたい",
    },
  },
  {
    id: "system",
    label: "システム移行",
    type: "share",
    data: {
      topic: "経費精算システムの移行",
      participant: "全社員",
      detail: "来月から新システムに切り替え。操作方法の説明と、移行期間中の注意事項を共有したい",
    },
  },
  {
    id: "new-member",
    label: "新メンバー",
    type: "share",
    data: {
      topic: "新入社員の紹介",
      participant: "チームメンバー全員",
      detail:
        "来週入社する中途社員2名の紹介。経歴と担当業務を共有し、オンボーディング協力をお願いしたい",
    },
  },
  {
    id: "progress",
    label: "進捗報告",
    type: "share",
    data: {
      topic: "大型案件の進捗報告",
      participant: "関係者全員、経営陣",
      detail: "予定通り進行中。マイルストーン達成状況と、今後のスケジュールを共有したい",
    },
  },

  // discussion（ディスカッション）
  {
    id: "overtime",
    label: "残業削減",
    type: "discussion",
    data: {
      topic: "チームの残業削減について",
      participant: "チームメンバー全員、マネージャー",
      detail: "直近3ヶ月で残業が増加傾向。原因と対策を話し合いたい。メンバーからの提案も聞きたい",
    },
  },
  {
    id: "goal",
    label: "来期目標",
    type: "discussion",
    data: {
      topic: "来期のチーム目標設定",
      participant: "チームメンバー全員",
      detail:
        "会社の方針は出たが、チームとして何にフォーカスするか議論したい。各自の意見を聞きたい",
    },
  },
  {
    id: "meeting-review",
    label: "会議の見直し",
    type: "discussion",
    data: {
      topic: "定例会議の見直し",
      participant: "チームリーダー陣",
      detail: "会議が多すぎるという声がある。本当に必要な会議はどれか、整理したい",
    },
  },
  {
    id: "claim",
    label: "クレーム対応",
    type: "discussion",
    data: {
      topic: "クレーム対応フローの改善",
      participant: "CS、営業、開発",
      detail: "同じようなクレームが繰り返し発生。根本原因と対策を部門横断で議論したい",
    },
  },
  {
    id: "new-business",
    label: "新規事業",
    type: "discussion",
    data: {
      topic: "新規事業のアイデア出し",
      participant: "有志メンバー、経営企画",
      detail: "社長から「新しい収益源を考えて」と指示。まずは自由にアイデアを出し合いたい",
    },
  },
];

/**
 * 会議タイプでフィルタリングしたサンプル事例を取得
 */
export function getSampleCasesByType(type: MeetingType): SampleCase[] {
  return sampleCases.filter((sample) => sample.type === type);
}

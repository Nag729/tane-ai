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
      theme: "来期の採用計画",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "人事、各チームマネージャー、経営企画" },
        { id: "2", label: "背景", value: "事業拡大で人員が不足。営業とCSで特に負荷が高い" },
      ],
    },
  },
  {
    id: "release",
    label: "リリース時期",
    type: "decision",
    data: {
      theme: "新サービスのリリース時期",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "プロダクトマネージャー、営業、CS、開発" },
        { id: "2", label: "背景", value: "機能は8割完成。年度内に出すか、品質を上げて来期にするか迷っている" },
      ],
    },
  },
  {
    id: "office",
    label: "オフィス移転",
    type: "decision",
    data: {
      theme: "オフィス移転先",
      verb: "選定する",
      supplements: [
        { id: "1", label: "参加者", value: "経営陣、総務、各部門長" },
        { id: "2", label: "背景", value: "現オフィスの契約更新が半年後。3候補まで絞った" },
        { id: "3", label: "制約", value: "コスト・アクセス・広さのバランスが重要" },
      ],
    },
  },
  {
    id: "tool",
    label: "ツール選定",
    type: "decision",
    data: {
      theme: "プロジェクト管理ツール",
      verb: "選定する",
      supplements: [
        { id: "1", label: "参加者", value: "マネージャー陣、情シス" },
        { id: "2", label: "背景", value: "現状Excelで管理限界。Notion、Asana、Backlogで迷っている" },
      ],
    },
  },
  {
    id: "pricing",
    label: "価格改定",
    type: "decision",
    data: {
      theme: "サービスの価格改定",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "経営陣、営業、カスタマーサクセス" },
        { id: "2", label: "背景", value: "原価高騰で利益率が低下。値上げしたいが、顧客離れも心配" },
      ],
    },
  },

  // share（情報共有）
  {
    id: "org-change",
    label: "組織変更",
    type: "share",
    data: {
      theme: "4月からの組織変更",
      verb: "共有する",
      supplements: [
        { id: "1", label: "参加者", value: "全社員" },
        { id: "2", label: "背景", value: "新規事業部の設立と、それに伴う人員異動がある" },
      ],
    },
  },
  {
    id: "remote",
    label: "リモート制度",
    type: "share",
    data: {
      theme: "リモートワーク制度の変更",
      verb: "周知する",
      supplements: [
        { id: "1", label: "参加者", value: "全社員" },
        { id: "2", label: "背景", value: "週2出社から週3出社に変更。適用は来月から" },
      ],
    },
  },
  {
    id: "system",
    label: "システム移行",
    type: "share",
    data: {
      theme: "経費精算システムの移行",
      verb: "説明する",
      supplements: [
        { id: "1", label: "参加者", value: "全社員" },
        { id: "2", label: "背景", value: "来月から新システムに切り替え。操作方法の説明が必要" },
      ],
    },
  },
  {
    id: "new-member",
    label: "新メンバー",
    type: "share",
    data: {
      theme: "新入社員の紹介",
      verb: "共有する",
      supplements: [
        { id: "1", label: "参加者", value: "チームメンバー全員" },
        { id: "2", label: "背景", value: "来週入社する中途社員2名の経歴と担当業務を共有したい" },
      ],
    },
  },
  {
    id: "progress",
    label: "進捗報告",
    type: "share",
    data: {
      theme: "大型案件の進捗",
      verb: "報告する",
      supplements: [
        { id: "1", label: "参加者", value: "関係者全員、経営陣" },
        { id: "2", label: "背景", value: "予定通り進行中。マイルストーン達成状況を共有したい" },
      ],
    },
  },

  // discussion（ディスカッション）
  {
    id: "overtime",
    label: "残業削減",
    type: "discussion",
    data: {
      theme: "チームの残業削減",
      verb: "議論する",
      supplements: [
        { id: "1", label: "参加者", value: "チームメンバー全員、マネージャー" },
        { id: "2", label: "背景", value: "直近3ヶ月で残業が増加傾向。原因と対策を話し合いたい" },
      ],
    },
  },
  {
    id: "goal",
    label: "来期目標",
    type: "discussion",
    data: {
      theme: "来期のチーム目標",
      verb: "検討する",
      supplements: [
        { id: "1", label: "参加者", value: "チームメンバー全員" },
        { id: "2", label: "背景", value: "会社の方針は出たが、チームとして何にフォーカスするか議論したい" },
      ],
    },
  },
  {
    id: "meeting-review",
    label: "会議の見直し",
    type: "discussion",
    data: {
      theme: "定例会議の見直し",
      verb: "議論する",
      supplements: [
        { id: "1", label: "参加者", value: "チームリーダー陣" },
        { id: "2", label: "背景", value: "会議が多すぎるという声がある。本当に必要な会議はどれか整理したい" },
      ],
    },
  },
  {
    id: "claim",
    label: "クレーム対応",
    type: "discussion",
    data: {
      theme: "クレーム対応フローの改善",
      verb: "相談する",
      supplements: [
        { id: "1", label: "参加者", value: "CS、営業、開発" },
        { id: "2", label: "背景", value: "同じようなクレームが繰り返し発生。根本原因と対策を部門横断で議論したい" },
      ],
    },
  },
  {
    id: "new-business",
    label: "新規事業",
    type: "discussion",
    data: {
      theme: "新規事業のアイデア",
      verb: "ブレストする",
      supplements: [
        { id: "1", label: "参加者", value: "有志メンバー、経営企画" },
        { id: "2", label: "背景", value: "社長から「新しい収益源を考えて」と指示があった" },
        { id: "3", label: "ゴール", value: "まずは自由にアイデアを出し合いたい" },
      ],
    },
  },
];

/**
 * 会議タイプでフィルタリングしたサンプル事例を取得
 */
export function getSampleCasesByType(type: MeetingType): SampleCase[] {
  return sampleCases.filter((sample) => sample.type === type);
}

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
  // decision（決める会議）
  {
    id: "hiring",
    label: "採用計画",
    type: "decision",
    data: {
      theme: "エンジニア3名の中途採用",
      verb: "承認を得る",
      supplements: [
        { id: "1", label: "参加者", value: "CTO、人事部長、開発マネージャー2名" },
        {
          id: "2",
          label: "背景",
          value: "新規プロダクト開発が決定。現チームでは人手不足で来期ローンチに間に合わない",
        },
        { id: "3", label: "制約", value: "年間予算は2,400万円まで。4月入社が理想" },
      ],
    },
  },
  {
    id: "pricing",
    label: "料金プラン",
    type: "decision",
    data: {
      theme: "SaaSの料金プラン改定",
      verb: "決定する",
      supplements: [
        { id: "1", label: "参加者", value: "CEO、CFO、営業責任者、カスタマーサクセス責任者" },
        { id: "2", label: "背景", value: "競合が値下げ攻勢。現行プランでは中小企業の獲得が難しい" },
        {
          id: "3",
          label: "ゴール",
          value: "エントリープラン新設 or 既存プラン値下げ、どちらかに決める",
        },
      ],
    },
  },
  {
    id: "vendor",
    label: "ベンダー選定",
    type: "decision",
    data: {
      theme: "基幹システムのリプレイスベンダー",
      verb: "選定する",
      supplements: [
        { id: "1", label: "参加者", value: "情シス部長、経理部長、各事業部の代表者" },
        {
          id: "2",
          label: "背景",
          value: "現システムの保守期限が1年後。3社から提案を受けて最終選考中",
        },
        { id: "3", label: "制約", value: "移行期間は6ヶ月以内。予算は5,000万円" },
      ],
    },
  },

  // share（伝える会議）
  {
    id: "new-policy",
    label: "人事制度",
    type: "share",
    data: {
      theme: "評価制度の刷新",
      verb: "説明する",
      supplements: [
        { id: "1", label: "参加者", value: "全マネージャー（約30名）" },
        { id: "2", label: "背景", value: "年功序列から成果主義へ移行。来期から新制度を適用" },
        {
          id: "3",
          label: "ゴール",
          value: "制度の意図を理解してもらい、部下への説明ができる状態にする",
        },
      ],
    },
  },
  {
    id: "incident",
    label: "障害報告",
    type: "share",
    data: {
      theme: "先週のシステム障害の原因と対策",
      verb: "報告する",
      supplements: [
        { id: "1", label: "参加者", value: "経営陣、開発チーム、カスタマーサクセス" },
        { id: "2", label: "背景", value: "3時間のサービス停止が発生。顧客からの問い合わせ多数" },
        {
          id: "3",
          label: "ゴール",
          value: "原因・対策・再発防止策を共有し、信頼回復に向けた方針を伝える",
        },
      ],
    },
  },
  {
    id: "kickoff",
    label: "プロジェクト説明",
    type: "share",
    data: {
      theme: "新プロジェクトのキックオフ",
      verb: "共有する",
      supplements: [
        { id: "1", label: "参加者", value: "プロジェクトメンバー8名、関連部署のリーダー" },
        { id: "2", label: "背景", value: "大口顧客向けのカスタム開発。納期は3ヶ月後" },
        {
          id: "3",
          label: "ゴール",
          value: "目的・スコープ・役割分担・マイルストーンを全員が理解した状態にする",
        },
      ],
    },
  },

  // discussion（話し合う会議）
  {
    id: "productivity",
    label: "生産性改善",
    type: "discussion",
    data: {
      theme: "開発チームの生産性を上げる方法",
      verb: "議論する",
      supplements: [
        { id: "1", label: "参加者", value: "開発チーム全員（8名）" },
        {
          id: "2",
          label: "背景",
          value: "ここ半年でリリース頻度が落ちている。会議・割り込み・技術的負債が原因っぽい",
        },
        { id: "3", label: "ゴール", value: "具体的な改善アクションを3つ決める" },
      ],
    },
  },
  {
    id: "career",
    label: "キャリアパス",
    type: "discussion",
    data: {
      theme: "エンジニアのキャリアパス制度",
      verb: "検討する",
      supplements: [
        { id: "1", label: "参加者", value: "CTO、VPoE、シニアエンジニア数名" },
        {
          id: "2",
          label: "背景",
          value: "マネジメント以外のキャリアパスがなく、優秀なエンジニアが辞めていく",
        },
        { id: "3", label: "ゴール", value: "スペシャリストトラックの方向性を決める" },
      ],
    },
  },
  {
    id: "onboarding",
    label: "オンボーディング",
    type: "discussion",
    data: {
      theme: "新入社員のオンボーディング改善",
      verb: "相談する",
      supplements: [
        { id: "1", label: "参加者", value: "人事、各チームのメンター担当者" },
        {
          id: "2",
          label: "背景",
          value: "入社後3ヶ月の離職率が高い。「放置された」という声が多い",
        },
        { id: "3", label: "ゴール", value: "改善のアイデアを出し合い、優先度をつける" },
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

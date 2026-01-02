import type { MeetingType } from "@/types";

type InitialInputData = {
  topic: string;
  participant: string;
  detail: string;
};

/**
 * テスト用の初期入力データ
 * Web系企業の一般的なビジネスシーンを想定
 */
const testDataByType: Record<MeetingType, InitialInputData[]> = {
  decision: [
    // 採用計画
    {
      topic: "来期の採用計画",
      participant: "人事、各チームマネージャー、経営企画",
      detail:
        "事業拡大で人員が不足。営業とCSで特に負荷が高い。予算は確保済みだが、何人採用するか決めたい",
    },
    // 新サービスリリース
    {
      topic: "新サービスのリリース時期",
      participant: "プロダクトマネージャー、営業、CS、開発",
      detail:
        "機能は8割完成。年度内に出すか、品質を上げて来期にするか迷っている。競合の動きも気になる",
    },
    // オフィス移転
    {
      topic: "オフィス移転先の決定",
      participant: "経営陣、総務、各部門長",
      detail:
        "現オフィスの契約更新が半年後。3候補まで絞った。コスト・アクセス・広さのバランスで決めたい",
    },
    // ツール導入
    {
      topic: "プロジェクト管理ツールの選定",
      participant: "マネージャー陣、情シス",
      detail:
        "現状Excelで管理限界。Notion、Asana、Backlogで迷ってる。コストと使いやすさのバランスが重要",
    },
    // 価格改定
    {
      topic: "サービスの価格改定",
      participant: "経営陣、営業、カスタマーサクセス",
      detail: "原価高騰で利益率が低下。値上げしたいが、顧客離れも心配。どの程度上げるか決めたい",
    },
  ],
  share: [
    // 組織変更
    {
      topic: "4月からの組織変更について",
      participant: "全社員",
      detail: "新規事業部の設立と、それに伴う人員異動。影響を受けるメンバーへの説明が必要",
    },
    // 勤怠ルール変更
    {
      topic: "リモートワーク制度の変更",
      participant: "全社員",
      detail: "週2出社から週3出社に変更。適用は来月から。各自のスケジュール調整をお願いしたい",
    },
    // システム変更
    {
      topic: "経費精算システムの移行",
      participant: "全社員",
      detail: "来月から新システムに切り替え。操作方法の説明と、移行期間中の注意事項を共有したい",
    },
    // 新メンバー紹介
    {
      topic: "新入社員の紹介",
      participant: "チームメンバー全員",
      detail:
        "来週入社する中途社員2名の紹介。経歴と担当業務を共有し、オンボーディング協力をお願いしたい",
    },
    // プロジェクト進捗
    {
      topic: "大型案件の進捗報告",
      participant: "関係者全員、経営陣",
      detail: "予定通り進行中。マイルストーン達成状況と、今後のスケジュールを共有したい",
    },
  ],
  discussion: [
    // 働き方改善
    {
      topic: "チームの残業削減について",
      participant: "チームメンバー全員、マネージャー",
      detail: "直近3ヶ月で残業が増加傾向。原因と対策を話し合いたい。メンバーからの提案も聞きたい",
    },
    // 来期目標
    {
      topic: "来期のチーム目標設定",
      participant: "チームメンバー全員",
      detail:
        "会社の方針は出たが、チームとして何にフォーカスするか議論したい。各自の意見を聞きたい",
    },
    // 業務改善
    {
      topic: "定例会議の見直し",
      participant: "チームリーダー陣",
      detail: "会議が多すぎるという声がある。本当に必要な会議はどれか、整理したい",
    },
    // 顧客対応
    {
      topic: "クレーム対応フローの改善",
      participant: "CS、営業、開発",
      detail: "同じようなクレームが繰り返し発生。根本原因と対策を部門横断で議論したい",
    },
    // 新規事業
    {
      topic: "新規事業のアイデア出し",
      participant: "有志メンバー、経営企画",
      detail: "社長から「新しい収益源を考えて」と指示。まずは自由にアイデアを出し合いたい",
    },
  ],
};

/**
 * デバッグモードが有効かどうか
 */
export function isDebugMode(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
}

/**
 * 指定された種類のテストデータをランダムに取得
 */
export function getRandomTestData(type: MeetingType): InitialInputData {
  const patterns = testDataByType[type];
  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex];
}

import type { HorensoType } from "@/types";

type InitialInputData = {
  topic: string;
  recipient: string;
  detail: string;
};

/**
 * テスト用の初期入力データ
 * 開発チーム（エンジニア・PdM）向けのシナリオ
 */
const testDataByType: Record<HorensoType, InitialInputData[]> = {
  report: [
    {
      topic: "スプリント3の進捗状況",
      recipient: "PdM（技術詳細より機能の完成度を気にする人）",
      detail:
        "予定していた5つのストーリーのうち3つ完了。認証機能でCognito連携に想定外の工数がかかっている。来週前半で巻き返せる見込み",
    },
    {
      topic: "本番環境のパフォーマンス改善結果",
      recipient: "テックリードとPdM",
      detail:
        "先週リリースしたキャッシュ導入の効果が出た。API応答時間が平均800ms→120msに改善。エラーレートも0.5%→0.1%に減少",
    },
    {
      topic: "技術的負債の解消状況",
      recipient: "EM（Engineering Manager）",
      detail:
        "Q3で対応予定だったレガシーAPI移行、70%完了。残り3エンドポイントは来月中に対応予定。Breaking changeはないのでクライアント側の修正は不要",
    },
  ],
  contact: [
    {
      topic: "明日のリリースについて",
      recipient: "開発チーム全員（エンジニア5人、QA2人）",
      detail:
        "明日14時にv2.3.0をリリース予定。今日中にQAお願いしたい。ステージング環境にデプロイ済み。リリースノートはNotionに書いた",
    },
    {
      topic: "ESLint設定の変更",
      recipient: "フロントエンドチーム",
      detail:
        "来週からstrictモードに移行する。既存のwarningは1週間かけて順次対応予定。新規コードは即適用。npm run lintで確認してほしい",
    },
    {
      topic: "来週のプランニングMTGの日程変更",
      recipient: "スクラムチーム全員",
      detail:
        "月曜10時→火曜10時に変更。PdMの出張が入ったため。カレンダー更新済み。バックログリファインメントは予定通り金曜に実施",
    },
  ],
  consult: [
    {
      topic: "状態管理ライブラリの選定",
      recipient: "テックリード",
      detail:
        "新規画面でグローバルステートが必要になった。Redux Toolkit・Zustand・Jotaiで迷っている。既存はContext APIのみ。チームはRedux経験者が少ない",
    },
    {
      topic: "フィーチャーフラグ導入の相談",
      recipient: "PdMとテックリード",
      detail:
        "大型機能のリリースを段階的にしたい。LaunchDarklyなどのSaaSを使うか、自前で実装するか。コストと運用負荷のバランスを相談したい",
    },
    {
      topic: "モノレポ移行のタイミング",
      recipient: "EMとテックリード",
      detail:
        "リポジトリが5つに増えて依存管理がつらくなってきた。Turborepo or Nxでのモノレポ化を検討中。移行コストと今後のメンテコスト削減を天秤にかけたい",
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
export function getRandomTestData(type: HorensoType): InitialInputData {
  const patterns = testDataByType[type];
  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex];
}

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
    // 詳細な報告（数値・具体的な状況が明確）
    {
      topic: "本番環境のパフォーマンス改善結果",
      recipient: "テックリードとPdM",
      detail:
        "先週リリースしたキャッシュ導入の効果が出た。API応答時間が平均800ms→120msに改善。エラーレートも0.5%→0.1%に減少",
    },
    // やや詳細（進捗と課題が明確）
    {
      topic: "スプリント3の進捗状況",
      recipient: "PdM（技術詳細より機能の完成度を気にする人）",
      detail:
        "予定していた5つのストーリーのうち3つ完了。認証機能でCognito連携に想定外の工数がかかっている。来週前半で巻き返せる見込み",
    },
    // 中程度（状況説明あり、詳細は省略）
    {
      topic: "技術的負債の解消状況",
      recipient: "EM",
      detail: "Q3で対応予定だったレガシーAPI移行、70%完了。残りは来月対応予定",
    },
    // ざっくり（要点のみ）
    {
      topic: "障害対応の報告",
      recipient: "チームリーダー",
      detail: "昨夜のDB接続エラー、原因特定して修正済み。再発防止策も考えた",
    },
    // 最小限（ほぼ情報なし）
    {
      topic: "新機能の実装完了",
      recipient: "PdM",
      detail: "検索機能できた",
    },
  ],
  contact: [
    // 詳細な連絡（日時・対象・アクションが明確）
    {
      topic: "明日のリリースについて",
      recipient: "開発チーム全員（エンジニア5人、QA2人）",
      detail:
        "明日14時にv2.3.0をリリース予定。今日中にQAお願いしたい。ステージング環境にデプロイ済み。リリースノートはNotionに書いた",
    },
    // やや詳細（変更内容と期待するアクションあり）
    {
      topic: "ESLint設定の変更",
      recipient: "フロントエンドチーム",
      detail:
        "来週からstrictモードに移行する。既存のwarningは1週間かけて順次対応予定。新規コードは即適用",
    },
    // 中程度（変更の事実と理由）
    {
      topic: "来週のプランニングMTGの日程変更",
      recipient: "スクラムチーム",
      detail: "月曜10時→火曜10時に変更。PdMの出張が入ったため",
    },
    // ざっくり（最低限の情報）
    {
      topic: "ドキュメント更新した",
      recipient: "チームメンバー",
      detail: "API仕様書を最新化した。確認してほしい",
    },
    // 最小限（ほぼ情報なし）
    {
      topic: "MTGのリマインド",
      recipient: "参加者",
      detail: "明日の定例、忘れないで",
    },
  ],
  consult: [
    // 詳細な相談（背景・選択肢・制約が明確）
    {
      topic: "状態管理ライブラリの選定",
      recipient: "テックリード",
      detail:
        "新規画面でグローバルステートが必要になった。Redux Toolkit・Zustand・Jotaiで迷っている。既存はContext APIのみ。チームはRedux経験者が少ない",
    },
    // やや詳細（目的と選択肢あり）
    {
      topic: "フィーチャーフラグ導入の相談",
      recipient: "PdMとテックリード",
      detail:
        "大型機能のリリースを段階的にしたい。LaunchDarklyなどのSaaSを使うか、自前で実装するか迷っている",
    },
    // 中程度（課題認識あり、解決策は未定）
    {
      topic: "モノレポ移行のタイミング",
      recipient: "EM",
      detail: "リポジトリが増えて依存管理がつらい。移行するべきか迷っている",
    },
    // ざっくり（漠然とした悩み）
    {
      topic: "テストの書き方",
      recipient: "先輩エンジニア",
      detail: "単体テストどこまで書くべきかわからない",
    },
    // 最小限（ほぼ情報なし）
    {
      topic: "設計について",
      recipient: "テックリード",
      detail: "このままでいいか不安",
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

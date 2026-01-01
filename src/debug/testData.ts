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
    // 詳細（数値はあるが、課題や次のアクションが曖昧）
    {
      topic: "本番環境のパフォーマンス改善について",
      recipient: "テックリードとPdM",
      detail:
        "キャッシュ入れたら速くなった気がする。800msが120msくらいになったっぽい。エラーも減った。でもメモリ使用量が増えてる気もするんだよね。これって報告した方がいいのかな",
    },
    // やや詳細（進捗はあるが、見通しに自信がない）
    {
      topic: "スプリント3の状況",
      recipient: "PdM",
      detail:
        "5つのストーリーのうち3つ終わった。認証のところで詰まってる。Cognito連携が思ったより大変。来週には何とかなると思うけど、正直自信ない",
    },
    // 中程度（状況はあるが、判断を求めている）
    {
      topic: "技術的負債の対応",
      recipient: "EM",
      detail:
        "レガシーAPI移行、7割くらい終わった。残りは来月やる予定だけど、優先度これでいいのかな",
    },
    // ざっくり（事実はあるが、次のアクションが未定）
    {
      topic: "昨夜の障害について",
      recipient: "チームリーダー",
      detail:
        "DB接続エラー直した。原因はコネクションプールの設定ミス。再発防止どうしよう",
    },
    // 最小限（ほぼ情報なし）
    {
      topic: "新機能の実装",
      recipient: "PdM",
      detail: "検索できるようになった。動作確認してほしい",
    },
  ],
  contact: [
    // 詳細（内容はあるが、伝える範囲が曖昧）
    {
      topic: "明日のリリースについて",
      recipient: "関係者",
      detail:
        "v2.3.0を明日リリースしたい。開発チームとQAには詳しく伝えたいけど、他のチームにはどこまで共有すべき？CSチームにも影響あるかも",
    },
    // やや詳細（変更はあるが、対象範囲が不明確）
    {
      topic: "ESLintの設定変更",
      recipient: "エンジニア",
      detail:
        "strictモードにしたい。フロントだけ？バックエンドも？既存コードのwarningどうする？",
    },
    // 中程度（変更はあるが、周知範囲が不明確）
    {
      topic: "プランニングMTGの日程変更",
      recipient: "チーム",
      detail:
        "PdMの出張で月曜から火曜に変えたい。スクラムチームだけでいい？ステークホルダーにも言うべき？",
    },
    // ざっくり（共有したいが、誰に伝えるか迷っている）
    {
      topic: "ドキュメント更新",
      recipient: "メンバー",
      detail: "API仕様書直した。見てほしいけど、誰に声かければいい？",
    },
    // 最小限（リマインドしたいが、手段が未定）
    {
      topic: "明日のMTG",
      recipient: "参加者",
      detail: "リマインドしたい。Slackでいい？メール？",
    },
  ],
  consult: [
    // 詳細（選択肢はあるが、判断基準が不明確）
    {
      topic: "状態管理どうしよう",
      recipient: "テックリード",
      detail:
        "新しい画面でグローバルステートが必要になりそう。Redux ToolkitかZustandかJotaiか迷ってる。今はContext APIだけ。チームはRedux経験少ない。パフォーマンスも気になる。どれがいいかな",
    },
    // やや詳細（目的はあるが、トレードオフが不明確）
    {
      topic: "フィーチャーフラグ入れたい",
      recipient: "PdMとテックリード",
      detail:
        "大型機能のリリースを段階的にしたい。LaunchDarkly使うか自前で作るか。コストと保守性のバランスが分からない",
    },
    // 中程度（課題認識はあるが、判断基準が不明確）
    {
      topic: "モノレポにすべき？",
      recipient: "EM",
      detail:
        "リポジトリ増えてきてつらい。でも移行コストも怖い。どう判断すればいい？",
    },
    // ざっくり（漠然とした悩み）
    {
      topic: "テストの書き方",
      recipient: "先輩",
      detail: "単体テストどこまで書けばいいか分からない。カバレッジ何%目指す？",
    },
    // 最小限（ほぼ情報なし、不安だけ）
    {
      topic: "設計レビューしてほしい",
      recipient: "テックリード",
      detail: "今の設計で大丈夫か不安",
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

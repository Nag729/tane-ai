import type { MeetingType } from "@/types";

type InitialInputData = {
  topic: string;
  participant: string;
  detail: string;
};

/**
 * テスト用の初期入力データ
 * 開発チーム（エンジニア・PdM）向けのシナリオ
 */
const testDataByType: Record<MeetingType, InitialInputData[]> = {
  decision: [
    // 技術選定
    {
      topic: "来期の開発言語選定",
      participant: "テックリード、アーキテクト、PdM",
      detail:
        "Rust vs Go で迷ってる。パフォーマンスと学習コストのバランスを考えたい。チームはTypeScript経験者が多い",
    },
    // リリース判断
    {
      topic: "新機能のリリース日程",
      participant: "PdM、開発チーム、QA",
      detail:
        "機能はほぼ完成。リリース前のテスト期間をどれくらい取るか決めたい。ユーザーからの要望も強い",
    },
    // アーキテクチャ決定
    {
      topic: "マイクロサービス化の範囲",
      participant: "テックリード、インフラチーム",
      detail:
        "認証サービスを切り出すか迷ってる。運用コストとスケーラビリティのトレードオフ",
    },
    // ツール選定
    {
      topic: "フィーチャーフラグ導入",
      participant: "PdM、テックリード",
      detail:
        "LaunchDarkly使うか自前で作るか。コストと保守性のバランスが分からない",
    },
    // 優先度決定
    {
      topic: "技術的負債の対応順序",
      participant: "EM、テックリード",
      detail: "レガシーAPI移行とテストカバレッジ改善、どっちを先にやるべき？",
    },
  ],
  share: [
    // リリース通知
    {
      topic: "v2.3.0のリリース予定",
      participant: "開発チーム全員、QA、CS",
      detail:
        "明日14時リリース予定。リリース中の30分間ステージング環境使えなくなる。主要な変更点も共有したい",
    },
    // ポリシー変更
    {
      topic: "新しいコードレビュー規約",
      participant: "開発チーム全員",
      detail:
        "PRのサイズ制限（300行以内）とレビュー完了の目標時間（24時間）を周知したい",
    },
    // 技術情報共有
    {
      topic: "ESLint設定変更の案内",
      participant: "フロントエンドチーム",
      detail:
        "strictモードに変更した。既存コードのwarning対応方針も説明したい",
    },
    // スケジュール変更
    {
      topic: "プランニングMTGの日程変更",
      participant: "スクラムチーム",
      detail:
        "PdMの出張で月曜から火曜に変更。アジェンダは変更なし",
    },
    // 成果共有
    {
      topic: "パフォーマンス改善の結果報告",
      participant: "ステークホルダー、開発チーム",
      detail:
        "キャッシュ導入で応答時間が800msから120msに改善。次のステップも共有したい",
    },
  ],
  discussion: [
    // 技術アプローチ
    {
      topic: "API設計：REST vs GraphQL",
      participant: "バックエンド・フロントエンドエンジニア",
      detail:
        "新しいダッシュボード機能で複数データソースからの取得が必要。効率的なAPI設計を議論したい",
    },
    // アーキテクチャ検討
    {
      topic: "モノレポ移行の是非",
      participant: "テックリード、EM、インフラ",
      detail:
        "リポジトリ増えてきて管理がつらい。移行コストと運用メリットを整理したい",
    },
    // プロセス改善
    {
      topic: "テスト戦略の見直し",
      participant: "QA、開発チーム",
      detail:
        "単体テストどこまで書くか、E2Eとの棲み分けを議論したい。カバレッジ目標も決めたい",
    },
    // 設計レビュー
    {
      topic: "状態管理ライブラリの選定",
      participant: "フロントエンドチーム",
      detail:
        "Redux Toolkit、Zustand、Jotaiで迷ってる。チームの経験とパフォーマンス要件を考慮したい",
    },
    // 振り返り
    {
      topic: "直近のインシデント振り返り",
      participant: "オンコールチーム、開発リード",
      detail:
        "DB接続エラーの根本原因と再発防止策を議論したい。プロセス改善も検討",
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

# ほうれんそう AI - 実装タスク

> TDD（テスト駆動開発）で進める: Red → Green → Refactor

## Phase 1: プロジェクトセットアップ ✅

- [x] Next.js 16 + TypeScript プロジェクト作成
- [x] Tailwind CSS v4 セットアップ
- [x] Vitest + React Testing Library セットアップ
- [x] Storybook 10 セットアップ
- [x] ESLint 9 / Prettier 設定
- [x] 基本ディレクトリ構成作成
- [x] 環境変数設定（.env.example）
- [x] 型定義（src/types/index.ts）
- [x] nextjs-toploader（ページ遷移インジケーター）
- [ ] CI でテスト実行設定（GitHub Actions）

## Phase 2: 基盤コンポーネント ✅

| コンポーネント | テスト | 実装 | Storybook |
| -------------- | ------ | ---- | --------- |
| Button         | ✅ 7   | ✅   | ✅        |
| Card           | ✅ 3   | ✅   | ✅        |
| CardButton     | ✅ 4   | ✅   | ✅        |
| Input/Textarea | ✅ 8   | ✅   | ✅        |
| Chip           | ✅ 6   | ✅   | ✅        |

## Phase 3: Presentational Components ✅

| コンポーネント    | テスト | 実装 | Storybook | 説明                         |
| ----------------- | ------ | ---- | --------- | ---------------------------- |
| TypeSelector      | ✅ 6   | ✅   | ✅        | 報告/連絡/相談の選択         |
| InitialInputForm  | ✅ 6   | ✅   | ✅        | トピック・相手・詳細の入力   |
| AIMessageBubble   | ✅ 4   | ✅   | ✅        | AI の質問表示                |
| UserMessageBubble | ✅ 3   | ✅   | ✅        | ユーザーの回答表示           |
| ChoiceChips       | ✅ 6   | ✅   | ✅        | 選択肢グループ（単一/複数）  |
| OutputCard        | ✅ 5   | ✅   | ✅        | 構造化出力（Markdown/Plain） |
| FeedbackForm      | ✅ 5   | ✅   | ✅        | 再生成用フィードバック       |

**合計: 63 テスト ✅**

## Phase 4: 画面統合 ✅

### 4-1. トップページ（種類選択）

- [x] page.tsx に TypeSelector 統合
- [x] 選択後 /chat へ遷移

### 4-2. チャットページ（/chat）

- [x] InitialInputForm で初期入力
- [x] AIMessageBubble + ChoiceChips で対話
- [x] 質問ごとの自由入力
- [x] 「整理完了」ボタン表示
- [x] モックデータで動作確認

### 4-3. 結果ページ（/result）

- [x] OutputCard + FeedbackForm 統合
- [x] Markdown / プレーンテキスト切り替え
- [x] コピー機能
- [x] 再生成フロー（モック）

### 4-4. リファクタリング ✅

- [x] 型安全性改善（as const satisfies, readonly）
- [x] 未使用型の削除（InitialInput, ChatState）
- [x] 未使用コンポーネントの削除（ChatInput）
- [x] UserMessageBubble を Presentational Component として抽出
- [x] ChoiceChips の readonly 対応

## Phase 5: Claude API 連携 🔜

### 5-1. API クライアント

- [ ] lib/anthropic.ts: クライアント初期化
- [ ] エラーハンドリング、リトライロジック

### 5-2. Server Actions

- [ ] actions/generateFirstQuestion.ts（Extended Thinking 使用）
- [ ] actions/generateNextQuestion.ts
- [ ] actions/generateOutput.ts（Extended Thinking 使用）

### 5-3. ストリーミング

- [ ] hooks/useStreamingChat.ts

## Phase 6: 状態管理 / フロー接続

- [ ] hooks/useHorensoFlow.ts
  - 種類選択 → 入力 → 対話 → 出力 の状態遷移
  - 対話履歴の追加・更新
  - 再生成フロー
- [ ] 画面間の遷移統合

## Phase 7: 仕上げ

- [ ] レスポンシブ対応（モバイル最適化）
- [ ] ローディング状態 / スケルトン UI
- [ ] エラー表示 UI
- [ ] アニメーション追加（遊び心）
- [ ] OGP / メタデータ設定
- [ ] E2E テスト（Playwright）

## Phase 8: デプロイ

- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定
- [ ] 本番デプロイ
- [ ] 動作確認

---

## 現在のステータス

**完了**: Phase 1〜4（セットアップ + コンポーネント + 画面統合）
**次のアクション**: Phase 5 - Claude API 連携

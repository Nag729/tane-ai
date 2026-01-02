# たねAI - 実装タスク

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
| TypeSelector      | ✅ 6   | ✅   | ✅        | 意思判断/共有/議論の選択     |
| InitialInputForm  | ✅ 6   | ✅   | ✅        | トピック・参加者・詳細の入力 |
| AIMessageBubble   | ✅ 4   | ✅   | ✅        | AI の質問表示                |
| UserMessageBubble | ✅ 3   | ✅   | ✅        | ユーザーの回答表示           |
| ChoiceChips       | ✅ 6   | ✅   | ✅        | 選択肢グループ（単一/複数）  |
| OutputCard        | ✅ 5   | ✅   | ✅        | 構造化出力（Markdown）       |
| FeedbackForm      | ✅ 5   | ✅   | ✅        | 再生成用フィードバック       |
| ThinkingPanel     | ✅ 7   | ✅   | ✅        | Extended Thinking 表示       |
| StreamingText     | ✅ 7   | ✅   | ✅        | ストリーミングテキスト表示   |

## Phase 4: 画面統合 ✅

### 4-1. トップページ（種類選択）

- [x] page.tsx に TypeSelector 統合
- [x] 選択後 /chat へ遷移

### 4-2. チャットページ（/chat）

- [x] InitialInputForm で初期入力
- [x] AIMessageBubble + ChoiceChips で対話
- [x] 質問ごとの自由入力
- [x] 「資料完成」ボタン表示
- [x] ThinkingPanel で Extended Thinking 表示
- [x] StreamingText でストリーミング出力表示
- [x] 自動スクロール

### 4-3. 結果ページ（/result）

- [x] OutputCard + FeedbackForm 統合
- [x] Markdown / プレーンテキスト切り替え
- [x] コピー機能
- [x] 再生成フロー

### 4-4. リファクタリング ✅

- [x] 型安全性改善（as const satisfies, readonly）
- [x] 未使用型の削除（InitialInput, ChatState）
- [x] 未使用コンポーネントの削除（ChatInput）
- [x] UserMessageBubble を Presentational Component として抽出
- [x] ChoiceChips の readonly 対応
- [x] カスタムフック分離
  - useChatAnswers: 回答入力状態管理
  - useChat: チャットフロー管理
- [x] 定数ファイル分離（typeConfig → constants/meeting.ts）
- [x] ChatHistory コンポーネント抽出
- [x] components フォルダ構成整理（ui/, pages/, projects/）
- [x] FormField コンポーネント抽出（InitialInputForm のリファクタリング）
- [x] ChatFooter サブコンポーネント抽出
- [x] domain レイヤー導入
  - domain/chat/streamQuestion.ts: 質問生成ロジック
  - domain/chat/streamOutput.ts: 出力生成ロジック
- [x] lib 分離
  - lib/chatStorage.ts: セッションストレージ
  - lib/chatApi.ts: API フェッチ関数
- [x] hooks 分離
  - hooks/useThinking.ts: 思考状態管理

## Phase 5: Claude API 連携 ✅

### 5-1. API クライアント

- [x] lib/anthropic.ts: クライアント初期化
- [x] Extended Thinking 設定

### 5-2. API Routes（Route Handlers）

- [x] /api/chat/question: 質問生成（初回は Extended Thinking 使用）
- [x] /api/chat/output: 最終出力生成（Extended Thinking 使用）

### 5-3. ストリーミング

- [x] SSE（Server-Sent Events）でストリーミング
- [x] Extended Thinking のリアルタイム表示
- [x] 出力テキストのストリーミング表示

### 5-4. hooks

- [x] useChat.ts: チャットフロー管理
  - [x] submitInitialInput: 初期入力送信
  - [x] submitAnswer: 回答送信
  - [x] completeAndGenerate: 最終出力生成
  - [x] isThinking / thinkingContent: 思考状態管理
  - [x] streamingOutput: ストリーミング出力
- [x] useChatAnswers.ts: 回答入力状態管理

### 5-5. テスト

- [x] useChat.test.ts: 11 テスト
- [x] useChatAnswers.test.ts: 17 テスト
- [x] useThinking.test.ts: 6 テスト
- [x] chatStorage.test.ts: 5 テスト
- [x] chatApi.test.ts: 5 テスト
- [x] sse.test.ts: 8 テスト
- [x] FormField.test.tsx: 7 テスト

**テスト合計: 170 テスト（28 ファイル）**

## Phase 6: E2E テスト ✅

- [x] Playwright セットアップ
- [x] e2e/streaming.spec.ts: ストリーミング関連 E2E テスト
  - [x] API モック（page.route）
  - [x] 質問生成のストリーミング
  - [x] 出力生成のストリーミング
  - [x] 再生成フロー

## Phase 7: 仕上げ 🔜

- [x] レスポンシブ対応（モバイル最適化）
- [x] ローディング状態（思考中...）
- [x] エラー表示 UI
- [ ] アニメーション追加（遊び心）
- [ ] OGP / メタデータ設定
- [ ] CI でテスト実行設定（GitHub Actions）

## Phase 8: デプロイ

- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定
- [ ] 本番デプロイ
- [ ] 動作確認

---

## 現在のステータス

**完了**: Phase 1〜6（セットアップ + コンポーネント + 画面統合 + Claude API 連携 + E2E テスト）
**次のアクション**: Phase 7 - 仕上げ（アニメーション、OGP、CI）

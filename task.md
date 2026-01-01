# ほうれんそう AI - 実装タスク

> TDD（テスト駆動開発）で進める: Red → Green → Refactor

## Phase 1: プロジェクトセットアップ ✅

- [x] Next.js + TypeScript プロジェクト作成
- [x] Tailwind CSS セットアップ
- [x] Vitest + React Testing Library セットアップ
- [x] Storybook セットアップ
- [x] ESLint / Prettier 設定
- [x] 基本ディレクトリ構成作成
- [x] 環境変数設定（.env.example）
- [ ] CI でテスト実行設定（GitHub Actions）

## Phase 2: 基盤コンポーネント

各コンポーネントは TDD で実装: テスト → 実装 → リファクタ

### 2-1. Button

- [ ] Button.test.tsx: クリックイベント発火、disabled 状態、バリアント表示
- [ ] Button.tsx 実装
- [ ] リファクタ / スタイル調整

### 2-2. Card

- [ ] Card.test.tsx: children レンダリング、className 適用
- [ ] Card.tsx 実装
- [ ] リファクタ / スタイル調整

### 2-3. Input / Textarea

- [ ] Input.test.tsx: 値の変更、placeholder 表示、エラー状態
- [ ] Input.tsx / Textarea.tsx 実装
- [ ] リファクタ / スタイル調整

### 2-4. Chip（選択肢チップ）

- [ ] Chip.test.tsx: 選択状態、複数選択、クリックイベント
- [ ] Chip.tsx 実装
- [ ] リファクタ / スタイル調整

## Phase 3: 画面実装

### 3-1. 種類選択画面

- [ ] TypeSelector.test.tsx
  - 報告 / 連絡 / 相談 の 3 つが表示される
  - 選択すると onSelect が呼ばれる
  - 選択中の状態が視覚的に分かる
- [ ] TypeSelector.tsx 実装
- [ ] page.tsx 統合

### 3-2. 初期入力フォーム画面

- [ ] InputForm.test.tsx
  - 目的・相手・背景の 3 つの入力欄がある
  - 空欄があると送信できない（バリデーション）
  - 全入力後に送信すると onSubmit が呼ばれる
- [ ] InputForm.tsx 実装
- [ ] page.tsx 統合

### 3-3. 対話画面

- [ ] ChatMessage.test.tsx
  - AI の質問が表示される
  - 選択肢がチップで表示される
  - カスタム入力欄がある
- [ ] ChoiceChips.test.tsx
  - 単一選択モード: 1 つだけ選択可能
  - 複数選択モード: 複数選択可能
  - 選択状態が視覚的に分かる
- [ ] ChatView.test.tsx
  - 対話履歴が表示される
  - 「整理完了」ボタンが条件付きで表示される
- [ ] 各コンポーネント実装
- [ ] page.tsx 統合

### 3-4. 最終出力画面

- [ ] OutputView.test.tsx
  - 構造化された出力が表示される
  - Markdown / プレーンテキスト切り替えできる
  - コピーボタンでクリップボードにコピーされる
  - フィードバック入力 → 再生成ができる
- [ ] OutputView.tsx 実装
- [ ] page.tsx 統合

## Phase 4: Claude API 連携

### 4-1. API クライアント

- [ ] anthropic.test.ts: クライアント初期化、エラーハンドリング
- [ ] anthropic.ts 実装

### 4-2. Server Actions

- [ ] generateFirstQuestion.test.ts
  - 種類と初期入力から質問が生成される
  - Extended Thinking が使用される
  - エラー時にリトライされる
- [ ] generateFirstQuestion.ts 実装

- [ ] generateNextQuestion.test.ts
  - 対話履歴から次の質問が生成される
  - 「十分」判断フラグが返される
- [ ] generateNextQuestion.ts 実装

- [ ] generateOutput.test.ts
  - 対話履歴から構造化出力が生成される
  - Extended Thinking が使用される
- [ ] generateOutput.ts 実装

### 4-3. ストリーミング

- [ ] useStreamingChat.test.ts: ストリーミング状態管理
- [ ] useStreamingChat.ts 実装

## Phase 5: 状態管理 / フロー接続

- [ ] useHorensoFlow.test.ts
  - 種類選択 → 入力 → 対話 → 出力 の状態遷移
  - 対話履歴の追加・更新
  - 再生成フロー
- [ ] useHorensoFlow.ts 実装
- [ ] 画面間の遷移統合テスト

## Phase 6: 仕上げ

- [ ] レスポンシブ対応（モバイル最適化）
- [ ] ローディング状態 / スケルトン UI
- [ ] エラー表示 UI
- [ ] アニメーション追加（遊び心）
- [ ] OGP / メタデータ設定
- [ ] E2E テスト（Playwright）

## Phase 7: デプロイ

- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定
- [ ] 本番デプロイ
- [ ] 動作確認

---

## 技術スタック

| レイヤー       | 技術                                                      |
| -------------- | --------------------------------------------------------- |
| フロントエンド | Next.js 14 (App Router) + TypeScript                      |
| スタイリング   | Tailwind CSS                                              |
| バックエンド   | Next Server Actions                                       |
| AI             | Claude API (claude-sonnet-4-20250514) + Extended Thinking |
| ストリーミング | Vercel AI SDK                                             |
| テスト         | Vitest + React Testing Library + MSW                      |
| E2E テスト     | Playwright                                                |
| ホスティング   | Vercel                                                    |

---

## ディレクトリ構成（案）

```
src/
├── app/
│   ├── page.tsx              # 種類選択画面
│   ├── input/
│   │   └── page.tsx          # 初期入力フォーム
│   ├── chat/
│   │   └── page.tsx          # 対話画面
│   ├── result/
│   │   └── page.tsx          # 最終出力画面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # 基盤コンポーネント
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Card.tsx
│   │   ├── Card.test.tsx
│   │   ├── Input.tsx
│   │   ├── Input.test.tsx
│   │   ├── Chip.tsx
│   │   └── Chip.test.tsx
│   ├── TypeSelector.tsx
│   ├── TypeSelector.test.tsx
│   ├── InputForm.tsx
│   ├── InputForm.test.tsx
│   ├── ChatMessage.tsx
│   ├── ChatMessage.test.tsx
│   ├── ChoiceChips.tsx
│   ├── ChoiceChips.test.tsx
│   ├── OutputView.tsx
│   └── OutputView.test.tsx
├── actions/
│   ├── generateFirstQuestion.ts
│   ├── generateFirstQuestion.test.ts
│   ├── generateNextQuestion.ts
│   ├── generateNextQuestion.test.ts
│   ├── generateOutput.ts
│   └── generateOutput.test.ts
├── hooks/
│   ├── useHorensoFlow.ts
│   ├── useHorensoFlow.test.ts
│   ├── useStreamingChat.ts
│   └── useStreamingChat.test.ts
├── lib/
│   ├── anthropic.ts
│   ├── anthropic.test.ts
│   └── prompts.ts
├── types/
│   └── index.ts
└── test/
    ├── setup.ts              # テストセットアップ
    └── mocks/
        └── handlers.ts       # MSW ハンドラー
```

---

## TDD サイクル

```
1. Red:    失敗するテストを書く
2. Green:  テストが通る最小限の実装
3. Refactor: コードを綺麗にする（テストは通ったまま）
```

---

## 現在のステータス

**次のアクション**: Phase 1 - プロジェクトセットアップ（Vitest 含む）

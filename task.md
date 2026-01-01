# ほうれんそう AI - 実装タスク

## Phase 1: プロジェクトセットアップ

- [ ] Next.js + TypeScript プロジェクト作成
- [ ] Tailwind CSS セットアップ
- [ ] ESLint / Prettier 設定
- [ ] 基本ディレクトリ構成作成
- [ ] 環境変数設定（.env.local）

## Phase 2: 基盤コンポーネント

- [ ] カラーパレット / デザイントークン定義（任天堂風）
- [ ] 共通レイアウトコンポーネント
- [ ] Button コンポーネント（角丸・柔らかいデザイン）
- [ ] Card コンポーネント
- [ ] Input / Textarea コンポーネント
- [ ] 選択肢チップコンポーネント

## Phase 3: 画面実装（静的）

### 3-1. 種類選択画面

- [ ] 報告 / 連絡 / 相談 の選択 UI
- [ ] 各種類の説明表示
- [ ] 選択後の遷移

### 3-2. 初期入力フォーム画面

- [ ] 目的入力欄
- [ ] 相手入力欄（プレースホルダーで前提知識ナッジ）
- [ ] 背景入力欄
- [ ] バリデーション（全項目必須）
- [ ] 送信ボタン

### 3-3. 対話画面

- [ ] AI からの質問表示エリア
- [ ] 選択肢チップ（単一選択 / 複数選択対応）
- [ ] カスタム入力欄
- [ ] 送信ボタン
- [ ] 「整理完了」ボタン（AI 判断後に表示）
- [ ] 対話履歴表示

### 3-4. 最終出力画面

- [ ] 構造化された出力表示
- [ ] フォーマット切り替え（Markdown / プレーンテキスト）
- [ ] コピーボタン
- [ ] フィードバック入力欄
- [ ] 再生成ボタン
- [ ] 最初からやり直すリンク

## Phase 4: Claude API 連携

- [ ] Anthropic SDK セットアップ
- [ ] Server Action: 初回質問生成（Extended Thinking）
- [ ] Server Action: 対話中の質問生成
- [ ] Server Action: 最終出力生成（Extended Thinking）
- [ ] ストリーミング実装（Vercel AI SDK）
- [ ] エラーハンドリング（自動リトライ）

## Phase 5: 状態管理 / フロー接続

- [ ] 対話状態の管理（useState / useReducer）
- [ ] 画面間の遷移フロー
- [ ] AI 判断による「整理完了」ボタン表示ロジック
- [ ] フィードバック → 再生成フロー

## Phase 6: 仕上げ

- [ ] レスポンシブ対応（モバイル最適化）
- [ ] ローディング状態 / スケルトン UI
- [ ] エラー表示 UI
- [ ] アニメーション追加（遊び心）
- [ ] OGP / メタデータ設定

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
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Chip.tsx
│   ├── TypeSelector.tsx      # 種類選択
│   ├── InputForm.tsx         # 初期入力フォーム
│   ├── ChatMessage.tsx       # 対話メッセージ
│   ├── ChoiceChips.tsx       # 選択肢チップ
│   └── OutputView.tsx        # 最終出力表示
├── actions/
│   ├── generateFirstQuestion.ts
│   ├── generateNextQuestion.ts
│   └── generateOutput.ts
├── lib/
│   ├── anthropic.ts          # Claude API クライアント
│   └── prompts.ts            # プロンプトテンプレート
└── types/
    └── index.ts              # 型定義
```

---

## 現在のステータス

**次のアクション**: Phase 1 - プロジェクトセットアップ

# たねAI 🍏

質問に答えるだけで、会議の準備ができる。

## 概要

- **決める会議**: みんなで決断しよう
- **伝える会議**: 大切なことを届けよう
- **話し合う会議**: アイデアを育てよう

質問を通じて情報を整理し、構造化された会議資料を生成します。

## 技術スタック

| レイヤー               | 技術                                 |
| ---------------------- | ------------------------------------ |
| フレームワーク         | Next.js 15 (App Router) + TypeScript |
| スタイリング           | Tailwind CSS v4                      |
| AI                     | Claude API + Extended Thinking       |
| テスト                 | Vitest + React Testing Library       |
| E2E テスト             | Playwright                           |
| コンポーネントカタログ | Storybook 10                         |

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# ANTHROPIC_API_KEY を設定

# 開発サーバー起動
npm run dev
```

http://localhost:3000 でアクセス

## コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド
npm run storybook    # Storybook
npm run test         # テスト（watch モード）
npm run test:run     # テスト（1回実行）
npm run test:e2e     # E2E テスト
npm run lint         # ESLint
```

## テスト

- **Unit テスト**: Vitest
- **E2E テスト**: Playwright でストリーミング動作を検証

```bash
# Unit テスト
npm run test:run

# E2E テスト
npm run test:e2e
```

## ドキュメント

- [task.md](./task.md) - 実装タスク一覧
- [design.md](./design.md) - 設計ドキュメント
- [CLAUDE.md](./CLAUDE.md) - コーディングルール

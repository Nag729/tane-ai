# CLAUDE.md - ほうれんそうAI

このファイルはプロジェクト固有のコーディングルールを記録しています。

## プロジェクト概要

報告・連絡・相談を AI との対話で整理するツール。
任天堂みたいな遊び心のあるデザインで、使っていて楽しいアプリを目指す。

## 技術スタック

| レイヤー               | 技術                                 |
| ---------------------- | ------------------------------------ |
| フレームワーク         | Next.js 15 (App Router) + TypeScript |
| スタイリング           | Tailwind CSS v4                      |
| テスト                 | Vitest + React Testing Library       |
| コンポーネントカタログ | Storybook 10                         |
| Lint/Format            | ESLint 9 + Prettier                  |

## 開発フロー

TDD（テスト駆動開発）で進める:

1. **Red**: 失敗するテストを書く
2. **Green**: テストが通る最小限の実装
3. **Refactor**: コードを綺麗にする

## コンポーネント設計

### ディレクトリ構成

```
src/
├── app/              # Next.js App Router ページ
│   ├── api/chat/     # API Routes（question, output）
│   ├── chat/         # チャットページ
│   └── result/       # 結果ページ
├── components/
│   ├── ui/           # 基盤コンポーネント（Button, Card, Input, Chip, CardButton, FormField）
│   ├── pages/        # ページ固有コンポーネント
│   │   ├── home/     # トップページ（TypeSelector, InitialInputForm）
│   │   ├── chat/     # チャットページ（ChatHeader, ChatHistory, ChatFooter, etc.）
│   │   └── result/   # 結果ページ（OutputCard, FeedbackForm, etc.）
│   └── projects/     # 共有コンポーネント（ThinkingPanel, StreamingText, etc.）
├── domain/           # ビジネスロジック
│   └── chat/         # チャット関連（streamQuestion, streamOutput）
├── hooks/            # カスタムフック（useChat, useChatAnswers, useThinking）
├── lib/              # ユーティリティ（anthropic, prompts, sse, chatApi, chatStorage）
├── constants/        # 定数定義
└── types/            # 型定義
```

### ファイル命名

- コンポーネント: `ComponentName.tsx`
- テスト: `ComponentName.test.tsx`
- Storybook: `ComponentName.stories.tsx`

## テストルール

### 構造

```tsx
describe("ComponentName", () => {
  // Given: 前提条件
  // When: 操作
  // Then: 期待結果
  it("should do something", () => {
    // ...
  });
});
```

### ベストプラクティス

- `screen.getByRole()` を優先（アクセシビリティ重視）
- `data-testid` は最終手段
- 振る舞いをテストする（実装詳細ではなく）

## スタイリングルール

### カラーパレット

| 用途       | カラー                             |
| ---------- | ---------------------------------- |
| プライマリ | `emerald-500` / `emerald-600`      |
| セカンダリ | `amber-50` / `amber-100`           |
| テキスト   | `stone-800` / `stone-900`          |
| ボーダー   | `stone-200` / `stone-300`          |
| エラー     | `rose-400` / `rose-50`             |
| 背景       | `stone-50` (body) / `white` (card) |

### Tailwind v4 記法

任意の値ではなく、組み込みユーティリティを使う:

- `w-[400px]` → `w-100`
- `w-[500px]` → `w-125`
- `w-[600px]` → `w-150`

### フォント

丸ゴシック（M PLUS Rounded 1c）を使用:

```css
font-family: "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", sans-serif;
```

## Storybook ルール

### Interactive ストーリー

`render` を使う場合は `args` も必須:

```tsx
export const Interactive: Story = {
  args: {
    // 必須（使わなくても）
    onSelect: () => {},
  },
  render: function InteractiveComponent() {
    const [state, setState] = useState();
    return <Component state={state} onChange={setState} />;
  },
};
```

### インポート

`@storybook/react` を使用（ESLint ルールで許可済み）

## 型定義

`src/types/index.ts` に集約:

```typescript
// ほうれんそうの種類
type HorensoType = "report" | "contact" | "consult";
```

## コマンド

```bash
npm run dev          # 開発サーバー
npm run storybook    # Storybook
npm run test         # テスト（watch モード）
npm run test:run     # テスト（1回実行）
npm run lint         # ESLint
npx prettier --write "src/**/*.{ts,tsx}"  # フォーマット
npx tsc --noEmit     # 型チェック
```

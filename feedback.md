# Feedback

## P0: バグ修正（すぐやる）

### 日本語入力で誤送信する

- **対象**: `src/app/chat/page.tsx`
- **問題**: IME 変換確定の Enter で送信されてしまう
- **対応**: `onCompositionStart/End` で変換中フラグを管理

### Command + Enter で送信できない

- **対象**: `src/app/chat/page.tsx`
- **対応**: `e.metaKey && e.key === "Enter"` を追加

### 2回目の質問で ThinkingPanel がクリアされない

- **対象**: `src/hooks/useChat.ts`
- **問題**: `submitAnswer()` 時に `resetThinking()` が呼ばれていない
- **対応**: 回答送信時に thinking 状態をリセット

---

## P1: ThinkingPanel 改善

### デフォルトで閉じる + 思考中インジケーター

- **対象**: `src/components/projects/ThinkingPanel.tsx`
- **対応**:
  - `isExpanded` の初期値を `false` に
  - 閉じた状態でもヘッダーにパルスアニメーション表示

### 開閉アニメーションの追加

- **対象**: `src/components/projects/ThinkingPanel.tsx`
- **対応**: `transition-all duration-300` + `max-h-0/max-h-48` で高さアニメーション

### /result ページで ThinkingPanel を表示

- **対象**: `src/app/result/page.tsx`
- **問題**: 再生成時に思考過程が見えない
- **対応**: `useThinking()` を導入し、`RegeneratingCard` の上に配置

---

## P1: チャット UX 改善

### チャット履歴に質問も表示する

- **対象**: `src/components/pages/chat/ChatHistory.tsx`
- **問題**: 回答だけ表示されて、何に対する回答かわからない
- **対応**: AIMessage の questions も履歴に表示（Q&A 形式）

### チャット欄が質問と被る

- **対象**: `src/app/chat/page.tsx`
- **問題**: 固定フッターでコンテンツが隠れる
- **対応**: チャットエリアに `pb-64` を追加

---

## P1: 結果ページ改善

### コピー時の通知表示

- **対象**: `src/components/pages/result/OutputCard.tsx`
- **対応**:
  - `react-hot-toast` を導入
  - コピー成功時に「コピーしました！」表示

### コピーボタンの配置改善

- **対象**: `src/components/pages/result/OutputCard.tsx`
- **問題**: カード下部で見つけにくい
- **対応**: Markdown 表示エリアの右上に固定配置

---

## P2: UI の視認性改善

### 「これで始める」ボタンを目立たせる

- **対象**: `src/components/pages/home/InitialInputForm.tsx`
- **対応**:
  - サイズ拡大（`text-lg py-3`）
  - ホバーアニメーション（`hover:scale-105`）
  - シャドウ強調（`shadow-lg`）

### 質問回数を増やす（2回 → 3〜5回）

- **対象**: `src/lib/prompts.ts`
- **対応**: システムプロンプトに「最低3回の往復」「最初は前提確認から」を追加

---

## P3: 思考 → 質問のラグ解消

- **対象**: `src/domain/chat/streamQuestion.ts`, `src/hooks/useChat.ts`
- **問題**: Thinking 終了後に JSON パースで遅延
- **対応**: Thinking 終了と同時にスケルトン表示、パース完了で置き換え

---

## 要検討: 設計が必要な項目

### フィードバック UI をコメント追加方式に

- **対象**: `src/components/pages/result/FeedbackForm.tsx`
- **検討事項**:
  - Markdown 上で範囲選択 → コメント追加
  - Google ドキュメント風のサイドバー
  - 複数コメントを貯めて一括反映

### 任天堂風のイラスト・アニメーション

- **検討事項**:
  - AI 生成ツール: Midjourney / DALL-E / Stable Diffusion
  - 配置場所: ヘッダー？空き状態？ローディング？
  - 画面遷移: Framer Motion でペーパーマリオ風アニメーション

<!-- ### InitialInputForm を自由記述方式に変更

- **対象**: `src/components/pages/home/InitialInputForm.tsx`
- **方針**: 優秀なコーチとのメンタリングを再現する
  - コーチは「今日は何を話したい？」と聞く（フォームを埋めさせない）
  - ユーザーが自由に話す → コーチが深堀りの質問をする
  - topic / recipient は AI が対話の中で自然に聞き出す
- **現状の問題**:
  - 3フィールド（topic/recipient/detail）は「書類を埋めて」感がある
  - モヤモヤしてる時に「まず整理しろ」は本末転倒
- **UI 案**:
  ```
  💭 今日はどんなことを整理したい？
  [思いつくままに書いてね...]
  [話してみる 🎤]
  ```
- **実装ステップ**:
  1. 3フィールド → 単一 Textarea に変更
  2. プロンプト調整（自由記述から必要情報を引き出す質問を生成）
  3. （オプション）Web Speech API で音声入力対応 -->

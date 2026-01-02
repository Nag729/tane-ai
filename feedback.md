# Feedback

## P1: ThinkingPanel 改善

### /result ページで ThinkingPanel を表示

- **対象**: `src/app/result/page.tsx`
- **問題**: 再生成時に思考過程が見えない
- **対応**: `useThinking()` を導入し、`RegeneratingCard` の上に配置

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

## ミーティング参加者からのフィードバック想定レビュー

- 事前に、生成AIから建設的で批判的なフィードバックを得ることで、品質の高い事前資料でミーティングに臨めるようにしたい

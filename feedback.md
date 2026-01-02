# Feedback

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

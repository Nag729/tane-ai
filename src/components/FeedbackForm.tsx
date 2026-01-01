import { useState } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FeedbackFormProps = {
  onSubmit: (feedback: string) => void;
  isLoading?: boolean;
};

export function FeedbackForm({ onSubmit, isLoading = false }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = feedback.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
    setFeedback("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-sm font-medium text-stone-600">💬 フィードバックで再生成</div>
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="修正点や追加したい内容を入力..."
        rows={2}
      />
      <Button
        type="submit"
        disabled={!feedback.trim() || isLoading}
        variant="secondary"
        className="w-full"
      >
        {isLoading ? "再生成中..." : "🔄 再生成"}
      </Button>
    </form>
  );
}

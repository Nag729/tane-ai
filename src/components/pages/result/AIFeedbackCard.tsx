import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type AIFeedbackCardProps = {
  /** レビュー内容 */
  content: string;
  /** ストリーミング中かどうか */
  isStreaming?: boolean;
  /** フィードバックを反映して再生成するコールバック */
  onApplyFeedback?: () => void;
  /** 再生成中かどうか */
  isRegenerating?: boolean;
};

export function AIFeedbackCard({
  content,
  isStreaming = false,
  onApplyFeedback,
  isRegenerating = false,
}: AIFeedbackCardProps) {
  if (!content && !isStreaming) {
    return null;
  }

  return (
    <Card className="space-y-4 border-purple-200 bg-purple-50/50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-purple-800 flex items-center gap-1.5">
          <Search size={20} />
          <span>AIレビュー</span>
        </h2>
        {isStreaming && (
          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="bg-white/80 rounded-xl p-4 max-h-96 overflow-y-auto">
        <div className="prose prose-stone prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          {isStreaming && <span className="animate-pulse">▊</span>}
        </div>
      </div>

      {!isStreaming && content && onApplyFeedback && (
        <div className="flex justify-end">
          <Button onClick={onApplyFeedback} disabled={isRegenerating}>
            {isRegenerating ? (
              "再生成中..."
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles size={16} />
                <span>このフィードバックを反映して再生成</span>
              </span>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}

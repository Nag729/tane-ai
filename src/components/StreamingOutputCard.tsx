import { Card } from "@/components/ui/Card";
import { StreamingText } from "@/components/StreamingText";

export type StreamingOutputCardProps = {
  /** 出力内容 */
  content: string;
  /** ストリーミング中か */
  isStreaming: boolean;
};

export function StreamingOutputCard({ content, isStreaming }: StreamingOutputCardProps) {
  if (!content) return null;

  return (
    <Card className="space-y-2">
      <h3 className="text-sm font-medium text-stone-600">📝 出力を生成中...</h3>
      <div className="bg-stone-50 rounded-lg p-3 max-h-96 overflow-y-auto">
        <StreamingText content={content} isStreaming={isStreaming} />
      </div>
    </Card>
  );
}

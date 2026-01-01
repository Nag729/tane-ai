import { Card } from "@/components/ui/Card";
import { StreamingText } from "@/components/projects/StreamingText";

export type RegeneratingCardProps = {
  /** 再生成中のコンテンツ */
  content: string;
};

export function RegeneratingCard({ content }: RegeneratingCardProps) {
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-medium text-stone-800">📋 再生成中...</h2>
      <div className="bg-stone-50 rounded-xl p-4 min-h-32">
        <StreamingText content={content} isStreaming={true} />
      </div>
    </Card>
  );
}

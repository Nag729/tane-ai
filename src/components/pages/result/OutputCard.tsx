import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { StructuredOutput } from "@/types";

type OutputCardProps = {
  output: StructuredOutput;
};

export function OutputCard({ output }: OutputCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output.content);
  };

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-medium text-stone-800">📋 整理された内容</h2>

      <div className="bg-stone-50 rounded-xl p-4 min-h-32">
        <div className="prose prose-stone prose-sm max-w-none">
          <ReactMarkdown>{output.content}</ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCopy} variant="secondary" aria-label="コピー">
          📋 コピー
        </Button>
      </div>
    </Card>
  );
}

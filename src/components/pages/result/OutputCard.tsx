import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { StructuredOutput } from "@/types";

type OutputCardProps = {
  output: StructuredOutput;
};

export function OutputCard({ output }: OutputCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output.content);
    toast.success("コピーしました！", { icon: "📋" });
  };

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-medium text-stone-800">📋 整理された内容</h2>

      <div className="relative bg-stone-50 rounded-xl p-4 min-h-32">
        {/* コピーボタン（右上固定） */}
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-70 hover:opacity-100"
          aria-label="コピー"
        >
          📋
        </Button>

        <div className="prose prose-stone prose-sm max-w-none pr-10">
          <ReactMarkdown>{output.content}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
}

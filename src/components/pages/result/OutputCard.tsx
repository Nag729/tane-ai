import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

      <div className="relative bg-stone-50 rounded-xl min-h-32 max-h-[70vh] overflow-y-auto">
        {/* コピーボタン（スクロール時も上部に固定） */}
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-stone-50/95 backdrop-blur-sm">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="shadow-sm hover:shadow-md"
            aria-label="コピー"
          >
            📋 Markdown形式でコピー
          </Button>
        </div>

        <div className="px-4 pb-4 prose prose-stone prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.content}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
}

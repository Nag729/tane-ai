import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { StructuredOutput, OutputFormat } from "@/types";

type OutputCardProps = {
  output: StructuredOutput;
  format: OutputFormat;
  onFormatChange?: (format: OutputFormat) => void;
};

export function OutputCard({ output, format, onFormatChange }: OutputCardProps) {
  const content = format === "markdown" ? output.markdown : output.plaintext;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-stone-800">📋 整理された内容</h2>
        <div className="flex gap-2">
          <Button
            variant={format === "markdown" ? "primary" : "secondary"}
            onClick={() => onFormatChange?.("markdown")}
            className="text-sm px-3 py-1"
          >
            Markdown
          </Button>
          <Button
            variant={format === "plaintext" ? "primary" : "secondary"}
            onClick={() => onFormatChange?.("plaintext")}
            className="text-sm px-3 py-1"
            aria-label="プレーンテキスト"
          >
            プレーン
          </Button>
        </div>
      </div>

      <div className="bg-stone-50 rounded-xl p-4 min-h-32">
        {format === "markdown" ? (
          <div className="prose prose-stone prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-stone-800 font-sans text-sm">{content}</pre>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCopy} variant="secondary" aria-label="コピー">
          📋 コピー
        </Button>
      </div>
    </Card>
  );
}

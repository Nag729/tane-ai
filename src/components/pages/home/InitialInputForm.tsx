import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { VerbSelector } from "./VerbSelector";
import { SupplementList } from "./SupplementList";
import type { InitialInputData, Supplement, SupplementLabel } from "@/types";

type SampleCaseForDisplay = { id: string; label: string };

type InitialInputFormProps = {
  themePlaceholder: string;
  verbs: readonly string[];
  supplementLabels: readonly SupplementLabel[];
  onSubmit: (data: InitialInputData) => void;
  isLoading?: boolean;
  defaultValues?: InitialInputData;
  sampleCases: SampleCaseForDisplay[];
  onSampleSelect: (id: string) => void;
};

export function InitialInputForm({
  themePlaceholder,
  verbs,
  supplementLabels,
  onSubmit,
  isLoading = false,
  defaultValues,
  sampleCases,
  onSampleSelect,
}: InitialInputFormProps) {
  const [theme, setTheme] = useState(defaultValues?.theme ?? "");
  const [verb, setVerb] = useState(defaultValues?.verb ?? "");
  const [supplements, setSupplements] = useState<Supplement[]>(
    defaultValues?.supplements ? [...defaultValues.supplements] : []
  );
  const themeInputRef = useRef<HTMLInputElement>(null);

  const isValid = theme.trim() && verb.trim();

  useEffect(() => {
    themeInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    const validSupplements = supplements.filter((s) => s.value.trim());
    onSubmit({
      theme: theme.trim(),
      verb: verb.trim(),
      supplements: validSupplements,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* サンプル事例 */}
        {sampleCases.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-stone-500 flex items-center gap-1">
              <span>✨</span>
              <span>サンプルで試す</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleCases.map((sample) => (
                <Chip
                  key={sample.id}
                  label={sample.label}
                  onClick={() => onSampleSelect(sample.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* テーマ + 動詞 入力エリア */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={themeInputRef}
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={themePlaceholder}
            className="
              flex-1 min-w-48 px-4 py-3 rounded-xl
              text-base
              bg-white border-2 border-stone-200
              focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
              transition-colors
            "
          />
          <span className="text-stone-500">を</span>
          <VerbSelector verbs={verbs} value={verb} onChange={setVerb} placeholder="選択..." />
        </div>

        {/* 補足セクション */}
        <SupplementList
          supplements={supplements}
          onChange={setSupplements}
          labels={supplementLabels}
        />

        {/* 送信ボタン */}
        <Button type="submit" disabled={!isValid || isLoading} className="w-full py-2.5">
          {isLoading ? "準備中..." : "対話を始める →"}
        </Button>
      </form>
    </Card>
  );
}

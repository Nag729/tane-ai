import { SupplementItem } from "./SupplementItem";
import type { Supplement, SupplementLabel } from "@/types";

type SupplementListProps = {
  supplements: Supplement[];
  onChange: (supplements: Supplement[]) => void;
  labels: readonly SupplementLabel[];
};

function generateId(): string {
  return `sup-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function SupplementList({ supplements, onChange, labels }: SupplementListProps) {
  const handleAdd = () => {
    const newSupplement: Supplement = {
      id: generateId(),
      value: "",
    };
    onChange([...supplements, newSupplement]);
  };

  const handleRemove = (id: string) => {
    onChange(supplements.filter((s) => s.id !== id));
  };

  const handleLabelChange = (id: string, label: SupplementLabel | undefined) => {
    onChange(supplements.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  const handleValueChange = (id: string, value: string) => {
    onChange(supplements.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  return (
    <div className="space-y-3">
      {supplements.length > 0 && (
        <div className="space-y-2 p-3 bg-amber-50 rounded-xl">
          {supplements.map((supplement) => (
            <SupplementItem
              key={supplement.id}
              labels={labels}
              selectedLabel={supplement.label}
              value={supplement.value}
              onLabelChange={(label) => handleLabelChange(supplement.id, label)}
              onValueChange={(value) => handleValueChange(supplement.id, value)}
              onRemove={() => handleRemove(supplement.id)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="
          flex items-center gap-1
          text-sm text-emerald-600 hover:text-emerald-700
          font-medium
          transition-colors
        "
      >
        <span>＋</span>
        <span>補足を追加</span>
      </button>
    </div>
  );
}

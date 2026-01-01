import type { HorensoType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";

type TypeSelectorProps = {
  selected?: HorensoType;
  onSelect: (type: HorensoType) => void;
};

const typeOptions: { type: HorensoType; label: string; description: string }[] = [
  { type: "report", label: "📋 報告", description: "結果や状況を伝える" },
  { type: "contact", label: "📢 連絡", description: "情報を共有する" },
  { type: "consult", label: "💭 相談", description: "意見やアドバイスを求める" },
];

export function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {typeOptions.map(({ type, label, description }) => (
        <CardButton
          key={type}
          selected={selected === type}
          onClick={() => onSelect(type)}
          className="flex-1"
        >
          <div className="text-2xl mb-2">{label}</div>
          <div className={`text-sm ${selected === type ? "text-emerald-100" : "text-stone-500"}`}>
            {description}
          </div>
        </CardButton>
      ))}
    </div>
  );
}

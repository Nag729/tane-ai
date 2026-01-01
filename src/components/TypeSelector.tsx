import type { HorensoType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";

type TypeSelectorProps = {
  selected?: HorensoType;
  onSelect: (type: HorensoType) => void;
};

const typeOptions = [
  {
    type: "report",
    label: "📋 報告",
    description: "一発で伝わる報告を作る",
  },
  {
    type: "contact",
    label: "📢 連絡",
    description: "確実に届く連絡を作る",
  },
  {
    type: "consult",
    label: "💭 相談",
    description: "すぐ答えがもらえる相談を作る",
  },
] as const satisfies readonly { type: HorensoType; label: string; description: string }[];

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

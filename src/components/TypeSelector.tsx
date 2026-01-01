import type { HorensoType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";

type TypeSelectorProps = {
  selected?: HorensoType;
  onSelect: (type: HorensoType) => void;
};

const typeOptions: { type: HorensoType; label: string; description: string }[] = [
  { type: "report", label: "📋 報告", description: "結果や進捗を伝えたい" },
  { type: "contact", label: "📢 連絡", description: "お知らせしたいことがある" },
  { type: "consult", label: "💭 相談", description: "意見を聞きたい・助けてほしい" },
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

import type { MeetingType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";

type TypeSelectorProps = {
  onSelect: (type: MeetingType) => void;
};

const typeOptions = [
  {
    type: "decision",
    label: "💡 意思判断",
    description: "何かを決める会議",
  },
  {
    type: "share",
    label: "📢 共有・通達",
    description: "情報を伝える会議",
  },
  {
    type: "discussion",
    label: "💬 ディスカッション",
    description: "議論する会議",
  },
] as const satisfies readonly { type: MeetingType; label: string; description: string }[];

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {typeOptions.map(({ type, label, description }) => (
        <CardButton key={type} onClick={() => onSelect(type)} className="flex-1">
          <div className="text-2xl mb-2">{label}</div>
          <div className="text-sm text-stone-500">{description}</div>
        </CardButton>
      ))}
    </div>
  );
}

import type { MeetingType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";

type TypeSelectorProps = {
  onSelect: (type: MeetingType) => void;
};

const typeOptions = [
  {
    type: "decision",
    label: "💡 意思決定",
    description: "承認・判断を得たい",
  },
  {
    type: "share",
    label: "📢 情報共有",
    description: "伝達・報告したい",
  },
  {
    type: "discussion",
    label: "💬 ディスカッション",
    description: "アイデアを出し合いたい",
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

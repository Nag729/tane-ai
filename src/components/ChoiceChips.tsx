import { Chip } from "@/components/ui/Chip";
import type { QuestionOption } from "@/types";

type ChoiceChipsProps = {
  options: QuestionOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
};

export function ChoiceChips({
  options,
  selectedIds,
  onChange,
  multiSelect = false,
}: ChoiceChipsProps) {
  const handleClick = (optionId: string) => {
    if (multiSelect) {
      // 複数選択モード: トグル
      if (selectedIds.includes(optionId)) {
        onChange(selectedIds.filter((id) => id !== optionId));
      } else {
        onChange([...selectedIds, optionId]);
      }
    } else {
      // 単一選択モード: 置き換え
      onChange([optionId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          selected={selectedIds.includes(option.id)}
          onClick={() => handleClick(option.id)}
        />
      ))}
    </div>
  );
}

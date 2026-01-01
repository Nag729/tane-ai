import { ChoiceChips } from "@/components/projects/ChoiceChips";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Question } from "@/types";

export type QuestionCardProps = {
  /** 質問データ */
  question: Question;
  /** 選択された選択肢ID */
  selectedIds: string[];
  /** カスタム入力値 */
  customInput: string;
  /** 選択肢変更時のコールバック */
  onOptionChange: (ids: string[]) => void;
  /** カスタム入力変更時のコールバック */
  onCustomInputChange: (value: string) => void;
  /** キー押下時のコールバック（Enter送信用） */
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

export function QuestionCard({
  question,
  selectedIds,
  customInput,
  onOptionChange,
  onCustomInputChange,
  onKeyDown,
}: QuestionCardProps) {
  return (
    <Card className="space-y-2">
      <p className="text-stone-700 font-medium text-sm">
        {question.content}
        {question.multiSelect && <span className="text-stone-400 ml-2">（複数OK）</span>}
      </p>
      <ChoiceChips
        options={question.options}
        selectedIds={selectedIds}
        onChange={onOptionChange}
        multiSelect={question.multiSelect}
      />
      <Input
        value={customInput}
        onChange={(e) => onCustomInputChange(e.target.value)}
        placeholder={question.customInputPlaceholder || "自由に入力..."}
        onKeyDown={onKeyDown}
        className="mt-2"
      />
    </Card>
  );
}

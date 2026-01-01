import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/Button";
import type { AIMessage } from "@/types";

export type ChatFooterProps = {
  /** AI が ready と判断したか */
  isReady: boolean;
  /** ローディング中か */
  isLoading: boolean;
  /** 質問があるか */
  hasQuestions: boolean;
  /** 現在の AI メッセージ */
  currentAIMessage: AIMessage | undefined;
  /** 回答状態 */
  answers: Record<string, { selectedIds: string[]; customInput: string }>;
  /** 送信可能か */
  canSubmit: boolean;
  /** 完了ボタンクリック時 */
  onComplete: () => void;
  /** 送信ボタンクリック時 */
  onSubmit: () => void;
  /** 選択肢変更時 */
  onOptionChange: (questionId: string, ids: string[]) => void;
  /** カスタム入力変更時 */
  onCustomInputChange: (questionId: string, value: string) => void;
  /** キー押下時 */
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export function ChatFooter({
  isReady,
  isLoading,
  hasQuestions,
  currentAIMessage,
  answers,
  canSubmit,
  onComplete,
  onSubmit,
  onOptionChange,
  onCustomInputChange,
  onKeyDown,
}: ChatFooterProps) {
  return (
    <footer className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
      <div className="max-w-2xl mx-auto space-y-3">
        {isReady && !isLoading && (
          <Button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-700">
            ✨ 整理完了！結果を見る
          </Button>
        )}

        {!isReady &&
          !isLoading &&
          hasQuestions &&
          currentAIMessage?.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedIds={answers[q.id]?.selectedIds || []}
              customInput={answers[q.id]?.customInput || ""}
              onOptionChange={(ids) => onOptionChange(q.id, ids)}
              onCustomInputChange={(value) => onCustomInputChange(q.id, value)}
              onKeyDown={onKeyDown}
            />
          ))}

        {!isReady && canSubmit && !isLoading && (
          <Button onClick={onSubmit} className="w-full">
            次へ →
          </Button>
        )}

        {isLoading && <p className="text-center text-stone-500">思考中...</p>}
      </div>
    </footer>
  );
}

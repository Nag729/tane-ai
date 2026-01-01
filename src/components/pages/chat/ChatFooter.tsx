import { QuestionCard } from "@/components/pages/chat/QuestionCard";
import { Button } from "@/components/ui/Button";
import type { AIMessage } from "@/types";

export type ChatFooterProps = {
  isReady: boolean;
  isLoading: boolean;
  hasQuestions: boolean;
  currentAIMessage: AIMessage | undefined;
  answers: Record<string, { selectedIds: string[]; customInput: string }>;
  canSubmit: boolean;
  onComplete: () => void;
  onSubmit: () => void;
  onOptionChange: (questionId: string, ids: string[]) => void;
  onCustomInputChange: (questionId: string, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

function CompleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="w-full bg-green-600 hover:bg-green-700">
      ✨ 整理完了！結果を見る
    </Button>
  );
}

function SubmitButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="w-full">
      次へ →
    </Button>
  );
}

function LoadingIndicator() {
  return <p className="text-center text-stone-500">思考中...</p>;
}

export function ChatFooter(props: ChatFooterProps) {
  const { isReady, isLoading, hasQuestions, currentAIMessage, answers } = props;
  const { canSubmit, onComplete, onSubmit, onOptionChange, onCustomInputChange, onKeyDown } = props;

  const showComplete = isReady && !isLoading;
  const showQuestions = !isReady && !isLoading && hasQuestions;
  const showSubmit = !isReady && !isLoading && canSubmit;

  return (
    <footer className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
      <div className="max-w-2xl mx-auto space-y-3">
        {showComplete && <CompleteButton onClick={onComplete} />}

        {showQuestions &&
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

        {showSubmit && <SubmitButton onClick={onSubmit} />}

        {isLoading && <LoadingIndicator />}
      </div>
    </footer>
  );
}

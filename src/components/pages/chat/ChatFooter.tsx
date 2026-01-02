import { Button } from "@/components/ui/Button";

export type ChatFooterProps = {
  isReady: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  onComplete: () => void;
  onSubmit: () => void;
};

function CompleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="w-full bg-green-600 hover:bg-green-700">
      ✨ 資料完成！結果を見る
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
  return <p className="text-center text-stone-500">情報を集めています...</p>;
}

export function ChatFooter({
  isReady,
  isLoading,
  canSubmit,
  onComplete,
  onSubmit,
}: ChatFooterProps) {
  const showComplete = isReady && !isLoading;
  const showSubmit = !isReady && !isLoading && canSubmit;

  // 何も表示するものがなければ非表示
  if (!showComplete && !showSubmit && !isLoading) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-stone-200 p-4 fixed bottom-0 left-0 right-0">
      <div className="max-w-2xl mx-auto">
        {showComplete && <CompleteButton onClick={onComplete} />}
        {showSubmit && <SubmitButton onClick={onSubmit} />}
        {isLoading && <LoadingIndicator />}
      </div>
    </footer>
  );
}

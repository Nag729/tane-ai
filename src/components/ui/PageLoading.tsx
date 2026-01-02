type PageLoadingProps = {
  /** 表示するメッセージ */
  message?: string;
};

/**
 * ページ読み込み中の表示
 */
export function PageLoading({ message = "読み込み中" }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center gap-4">
        {/* ロゴ */}
        <div className="text-4xl">🍏</div>

        {/* ローディングドット */}
        <div className="flex items-center gap-1">
          <span className="text-emerald-600 font-medium">{message}</span>
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}

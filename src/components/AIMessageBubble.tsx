type AIMessageBubbleProps = {
  content: string;
  isStreaming?: boolean;
};

export function AIMessageBubble({ content, isStreaming = false }: AIMessageBubbleProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
        🤖
      </div>
      <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 shadow-md border border-stone-100">
        <p className="text-stone-800 whitespace-pre-wrap">{content}</p>
        {isStreaming && (
          <span
            data-testid="streaming-indicator"
            className="inline-block w-2 h-4 bg-emerald-500 animate-pulse ml-1"
          />
        )}
      </div>
    </div>
  );
}

type UserMessageBubbleProps = {
  readonly content: string;
};

export function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

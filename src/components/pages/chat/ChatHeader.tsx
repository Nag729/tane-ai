import { Sprout } from "lucide-react";

export type ChatHeaderProps = {
  /** ヘッダータイトルのラベル */
  label: string;
  /** 戻るボタンクリック時のコールバック */
  onBack: () => void;
};

export function ChatHeader({ label, onBack }: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button onClick={onBack} className="text-stone-500 hover:text-stone-700">
          ← やめる
        </button>
        <h1 className="font-bold text-stone-800 flex items-center gap-1.5">
          <Sprout className="text-emerald-500" size={20} />
          <span>{label}</span>
        </h1>
        <div className="w-16" />
      </div>
    </header>
  );
}

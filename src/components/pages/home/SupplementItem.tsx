import { useState, useRef, useEffect } from "react";
import type { SupplementLabel } from "@/types";

type SupplementItemProps = {
  labels: readonly SupplementLabel[];
  selectedLabel?: SupplementLabel;
  value: string;
  onLabelChange: (label: SupplementLabel | undefined) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
};

export function SupplementItem({
  labels,
  selectedLabel,
  value,
  onLabelChange,
  onValueChange,
  onRemove,
}: SupplementItemProps) {
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsLabelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 group">
      {/* ラベルセレクター */}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsLabelOpen(!isLabelOpen)}
          className={`
            px-3 py-2 rounded-lg
            text-sm font-medium
            transition-colors duration-200
            flex items-center gap-1 min-w-16 sm:min-w-20
            ${selectedLabel ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500"}
          `}
        >
          <span>{selectedLabel || "ラベル"}</span>
          <span className="text-xs opacity-50">▼</span>
        </button>

        {isLabelOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-10 min-w-24">
            <button
              type="button"
              onClick={() => {
                onLabelChange(undefined);
                setIsLabelOpen(false);
              }}
              className={`
                w-full px-3 py-1.5 text-left text-sm
                hover:bg-stone-50
                ${!selectedLabel ? "text-emerald-600 font-medium" : "text-stone-400"}
              `}
            >
              なし
            </button>
            {labels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  onLabelChange(label);
                  setIsLabelOpen(false);
                }}
                className={`
                  w-full px-3 py-1.5 text-left text-sm
                  hover:bg-stone-50
                  ${selectedLabel === label ? "text-emerald-600 font-medium" : "text-stone-700"}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 入力フィールド */}
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={selectedLabel ? `${selectedLabel}を入力...` : "補足情報を入力..."}
        className="
          w-full sm:flex-1 px-3 py-2 rounded-lg
          text-sm
          bg-white border border-stone-200
          focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
          transition-colors
        "
      />

      {/* 削除ボタン */}
      <button
        type="button"
        onClick={onRemove}
        className="
          p-2 rounded-lg
          text-stone-400 hover:text-rose-500 hover:bg-rose-50
          sm:opacity-0 sm:group-hover:opacity-100
          transition-all duration-200
        "
        aria-label="この補足を削除"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

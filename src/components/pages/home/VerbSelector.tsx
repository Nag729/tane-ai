import { useState, useRef, useEffect } from "react";

type VerbSelectorProps = {
  verbs: readonly string[];
  value: string;
  onChange: (verb: string) => void;
  placeholder?: string;
};

export function VerbSelector({
  verbs,
  value,
  onChange,
  placeholder = "選択...",
}: VerbSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPresetVerb = verbs.includes(value);
  const displayValue = value || placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustom]);

  const handleSelect = (verb: string) => {
    onChange(verb);
    setIsOpen(false);
    setIsCustom(false);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    setIsOpen(false);
    onChange("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCustomBlur = () => {
    if (!value) {
      setIsCustom(false);
    }
  };

  if (isCustom || (!isPresetVerb && value)) {
    return (
      <div className="relative" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleCustomChange}
          onBlur={handleCustomBlur}
          placeholder="動詞を入力..."
          className="
            px-4 py-2 rounded-full
            font-medium text-sm
            bg-emerald-500 text-white
            border-2 border-emerald-500
            focus:outline-none focus:ring-2 focus:ring-emerald-300
            w-28 sm:w-32 text-center
          "
        />
        <button
          type="button"
          onClick={() => {
            setIsCustom(false);
            onChange("");
          }}
          className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-stone-400 text-white text-xs hover:bg-rose-400 transition-colors"
          aria-label="リセット"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-full
          font-medium text-sm
          transition-colors duration-200
          flex items-center gap-1
          ${value ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}
        `}
      >
        <span>{displayValue}</span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-10 min-w-32 sm:min-w-36">
          {verbs.map((verb) => (
            <button
              key={verb}
              type="button"
              onClick={() => handleSelect(verb)}
              className={`
                w-full px-4 py-2 text-left text-sm
                hover:bg-stone-50
                ${value === verb ? "text-emerald-600 font-medium" : "text-stone-700"}
              `}
            >
              {verb}
            </button>
          ))}
          <hr className="my-1 border-stone-100" />
          <button
            type="button"
            onClick={handleCustomClick}
            className="w-full px-4 py-2 text-left text-sm text-stone-500 hover:bg-stone-50"
          >
            その他...
          </button>
        </div>
      )}
    </div>
  );
}

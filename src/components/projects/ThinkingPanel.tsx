"use client";

import { useState, useRef, useCallback } from "react";

type ThinkingPanelProps = {
  /** 思考内容（ストリーミング中は途中経過） */
  content: string;
  /** 思考中かどうか（falseになると自動で折りたたむ） */
  isThinking: boolean;
};

/**
 * 展開状態を管理するフック
 * - デフォルト値が変わるとユーザーのオーバーライドをリセット
 */
function useExpandedState(defaultExpanded: boolean) {
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const [prevDefault, setPrevDefault] = useState(defaultExpanded);

  // デフォルト値の変化に応じてオーバーライドをリセット
  if (defaultExpanded !== prevDefault) {
    setPrevDefault(defaultExpanded);
    setUserOverride(null);
  }

  const isExpanded = userOverride ?? defaultExpanded;
  const toggle = useCallback(
    () => setUserOverride((prev) => !(prev ?? defaultExpanded)),
    [defaultExpanded]
  );

  return { isExpanded, toggle };
}

/**
 * スクロール位置を監視するフック
 */
function useScrollAtBottom() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
    setIsAtBottom(atBottom);
  }, []);

  return { scrollRef, isAtBottom, handleScroll };
}

/**
 * Extended Thinking の内容を表示する折りたたみ可能なパネル
 * Claude Desktop風のUI
 */
export function ThinkingPanel({ content, isThinking }: ThinkingPanelProps) {
  const { isExpanded, toggle } = useExpandedState(isThinking);
  const { scrollRef, isAtBottom, handleScroll } = useScrollAtBottom();

  // 表示制御フラグ
  const hasContent = !!content;
  const showCursor = isThinking && hasContent;
  const showGradient = !isAtBottom && hasContent;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      {/* ヘッダー（クリックで開閉） */}
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 bg-amber-500 rounded-full ${isThinking ? "animate-pulse" : ""}`}
          />
          <span className="text-sm font-medium text-amber-800">
            {isThinking ? "思考中..." : "思考完了"}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-amber-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* コンテンツ（アニメーション付き） */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="bg-white/60 rounded-lg p-3 max-h-48 overflow-y-auto scrollbar-thin"
            >
              <p className="text-sm text-amber-900 whitespace-pre-wrap font-mono leading-relaxed">
                {content || (
                  <span className="text-amber-600 animate-pulse">情報を整理しています...</span>
                )}
                {showCursor && <span className="animate-pulse">▊</span>}
              </p>
            </div>
            {/* スクロール可能を示すグラデーション */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent rounded-b-lg pointer-events-none transition-opacity duration-200 ${
                showGradient ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

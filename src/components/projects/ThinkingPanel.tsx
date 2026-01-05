"use client";

import { useState, useRef, useCallback } from "react";

type ThinkingPanelProps = {
  /** 思考内容（ストリーミング中は途中経過） */
  content: string;
  /** 思考中かどうか（falseになると自動で折りたたむ） */
  isThinking: boolean;
};

/**
 * Extended Thinking の内容を表示する折りたたみ可能なパネル
 * Claude Desktop風のUI
 */
export function ThinkingPanel({ content, isThinking }: ThinkingPanelProps) {
  // ユーザーによる展開状態のオーバーライド（null = デフォルト動作）
  const [userExpandedOverride, setUserExpandedOverride] = useState<boolean | null>(null);
  const [prevIsThinking, setPrevIsThinking] = useState(isThinking);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // props の変化に応じてオーバーライドをリセット
  if (isThinking !== prevIsThinking) {
    setPrevIsThinking(isThinking);
    setUserExpandedOverride(null);
  }

  // 思考中は展開、完了時は折りたたむ（ユーザーがオーバーライド可能）
  const isExpanded = userExpandedOverride ?? isThinking;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // 一番下までスクロールしているかチェック（2pxの余裕を持たせる）
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
    setIsAtBottom(atBottom);
  }, []);

  // 内容がない場合は表示しない（表示制御は親コンポーネントで行う）
  if (!content) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      {/* ヘッダー（クリックで開閉） */}
      <button
        onClick={() => setUserExpandedOverride(!isExpanded)}
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
                {content}
                {isThinking && <span className="animate-pulse">▊</span>}
              </p>
            </div>
            {/* スクロール可能を示すグラデーション（一番下の時は非表示） */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent rounded-b-lg pointer-events-none transition-opacity duration-200 ${
                isAtBottom ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

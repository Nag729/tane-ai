"use client";

import { useState } from "react";

type ThinkingPanelProps = {
  /** 思考中かどうか */
  isThinking: boolean;
  /** 思考内容（ストリーミング中は途中経過） */
  content: string;
  /** パネルのタイトル */
  title?: string;
};

/**
 * Extended Thinking の内容を表示する折りたたみ可能なパネル
 * Claude Desktop風のUI
 */
export function ThinkingPanel({ isThinking, content, title = "思考中..." }: ThinkingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // 思考中でなく、内容もない場合は表示しない
  if (!isThinking && !content) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      {/* ヘッダー（クリックで開閉） */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isThinking && (
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          )}
          <span className="text-sm font-medium text-amber-800">{title}</span>
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
          <div className="bg-white/60 rounded-lg p-3 max-h-48 overflow-y-auto">
            {content ? (
              <p className="text-sm text-amber-900 whitespace-pre-wrap font-mono leading-relaxed">
                {content}
                {isThinking && <span className="animate-pulse">▊</span>}
              </p>
            ) : (
              <p className="text-sm text-amber-600 italic">考えています...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";

type StreamingTextProps = {
  /** 表示するテキスト（ストリーミング中は途中経過） */
  content: string;
  /** ストリーミング中かどうか */
  isStreaming?: boolean;
  /** Markdownとしてレンダリングするか */
  markdown?: boolean;
  /** カスタムクラス名 */
  className?: string;
};

/**
 * ストリーミングテキストを表示するコンポーネント
 * Markdownのリアルタイムレンダリングに対応
 */
export function StreamingText({
  content,
  isStreaming = false,
  markdown = true,
  className = "",
}: StreamingTextProps) {
  if (!content && !isStreaming) {
    return null;
  }

  const baseClass = "leading-relaxed";
  const combinedClass = `${baseClass} ${className}`.trim();

  // ストリーミング中のカーソル
  const cursor = isStreaming ? <span className="animate-pulse">▊</span> : null;

  if (markdown) {
    return (
      <div className={combinedClass}>
        <div className="prose prose-stone prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {cursor}
      </div>
    );
  }

  return (
    <div className={combinedClass}>
      <p className="whitespace-pre-wrap">{content}</p>
      {cursor}
    </div>
  );
}

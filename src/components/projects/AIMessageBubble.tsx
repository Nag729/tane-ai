"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { slideInLeft, defaultTransition } from "@/lib/motion";

type AIMessageBubbleProps = {
  content: string;
  isStreaming?: boolean;
};

export function AIMessageBubble({ content, isStreaming = false }: AIMessageBubbleProps) {
  return (
    <motion.div
      className="flex gap-3"
      variants={slideInLeft}
      initial="initial"
      animate="animate"
      transition={defaultTransition}
    >
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center">
        <Bot className="text-emerald-600 w-5 h-5 sm:w-5.5 sm:h-5.5" />
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
    </motion.div>
  );
}

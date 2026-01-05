"use client";

import { motion } from "framer-motion";
import { slideInRight, defaultTransition } from "@/lib/motion";

type UserMessageBubbleProps = {
  readonly content: string;
};

export function UserMessageBubble({ content }: UserMessageBubbleProps) {
  return (
    <motion.div
      className="flex justify-end"
      variants={slideInRight}
      initial="initial"
      animate="animate"
      transition={defaultTransition}
    >
      <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}

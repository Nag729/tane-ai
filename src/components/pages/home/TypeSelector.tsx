"use client";

import { motion } from "framer-motion";
import type { MeetingType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";
import { staggerContainer, staggerItem, defaultTransition } from "@/lib/motion";

type TypeSelectorProps = {
  onSelect: (type: MeetingType) => void;
};

const typeOptions = [
  {
    type: "decision",
    label: "💡 意思決定",
    description: "承認・判断を得たい",
  },
  {
    type: "share",
    label: "📢 情報共有",
    description: "伝達・報告したい",
  },
  {
    type: "discussion",
    label: "💬 ディスカッション",
    description: "アイデアを出し合いたい",
  },
] as const satisfies readonly { type: MeetingType; label: string; description: string }[];

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {typeOptions.map(({ type, label, description }) => (
        <motion.div
          key={type}
          className="flex-1"
          variants={staggerItem}
          transition={defaultTransition}
        >
          <CardButton onClick={() => onSelect(type)} className="h-full">
            <div className="text-2xl mb-2">{label}</div>
            <div className="text-sm text-stone-500">{description}</div>
          </CardButton>
        </motion.div>
      ))}
    </motion.div>
  );
}

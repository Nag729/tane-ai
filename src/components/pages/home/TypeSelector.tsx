"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Megaphone, MessageCircle } from "lucide-react";
import type { MeetingType } from "@/types";
import { CardButton } from "@/components/ui/CardButton";
import { staggerContainer, staggerItem, defaultTransition } from "@/lib/motion";

type TypeSelectorProps = {
  onSelect: (type: MeetingType) => void;
};

const typeOptions: readonly {
  type: MeetingType;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    type: "decision",
    label: "意思決定",
    description: "承認・判断を得たい",
    icon: <Lightbulb size={32} />,
  },
  {
    type: "share",
    label: "情報共有",
    description: "伝達・報告したい",
    icon: <Megaphone size={32} />,
  },
  {
    type: "discussion",
    label: "ディスカッション",
    description: "アイデアを出し合いたい",
    icon: <MessageCircle size={32} />,
  },
];

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {typeOptions.map(({ type, label, description, icon }) => (
        <motion.div
          key={type}
          className="flex-1"
          variants={staggerItem}
          transition={defaultTransition}
        >
          <CardButton onClick={() => onSelect(type)} className="h-full">
            <div className="flex items-center gap-2 text-xl mb-2">
              <span className="text-emerald-500">{icon}</span>
              <span>{label}</span>
            </div>
            <div className="text-sm text-stone-500">{description}</div>
          </CardButton>
        </motion.div>
      ))}
    </motion.div>
  );
}

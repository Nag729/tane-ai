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
  icon: ReactNode;
  label: string;
  description: string;
}[] = [
  {
    type: "decision",
    icon: <Lightbulb size={32} />,
    label: "決める会議",
    description: "みんなで決断しよう",
  },
  {
    type: "share",
    icon: <Megaphone size={32} />,
    label: "伝える会議",
    description: "大切なことを届けよう",
  },
  {
    type: "discussion",
    icon: <MessageCircle size={32} />,
    label: "話し合う会議",
    description: "アイデアを育てよう",
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
      {typeOptions.map(({ type, icon, label, description }) => (
        <motion.div
          key={type}
          className="flex-1"
          variants={staggerItem}
          transition={defaultTransition}
        >
          <CardButton onClick={() => onSelect(type)} className="h-full text-center">
            <div className="text-emerald-500 mb-2 flex justify-center">{icon}</div>
            <div className="text-lg font-medium mb-1">{label}</div>
            <div className="text-sm text-stone-500">{description}</div>
          </CardButton>
        </motion.div>
      ))}
    </motion.div>
  );
}

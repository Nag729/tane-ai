"use client";

import { type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { cardButtonAnimation } from "@/lib/motion";

type CardButtonProps = ComponentPropsWithoutRef<typeof motion.button> & {
  selected?: boolean;
};

export function CardButton({
  children,
  selected = false,
  disabled,
  className = "",
  ...props
}: CardButtonProps) {
  return (
    <motion.button
      type="button"
      className={`
        p-6 rounded-2xl w-full
        transition-colors duration-200
        border-2 shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-white text-stone-800 border-stone-200 hover:border-emerald-300"
        }
        ${className}
      `}
      disabled={disabled}
      {...(disabled ? {} : cardButtonAnimation)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

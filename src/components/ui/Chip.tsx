"use client";

import { type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { chipAnimation } from "@/lib/motion";

type ChipProps = Omit<ComponentPropsWithoutRef<typeof motion.button>, "children"> & {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false, disabled, className = "", ...props }: ChipProps) {
  return (
    <motion.button
      type="button"
      className={`
        px-4 py-2 rounded-full
        font-medium text-sm text-left
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
        }
        ${className}
      `}
      disabled={disabled}
      {...(disabled ? {} : chipAnimation)}
      {...props}
    >
      {label}
    </motion.button>
  );
}

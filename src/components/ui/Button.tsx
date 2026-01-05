"use client";

import { type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { buttonAnimation } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ComponentPropsWithoutRef<typeof motion.button> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
  secondary: "bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200",
  ghost: "bg-transparent hover:bg-stone-100 text-stone-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`
        rounded-xl font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled}
      {...(disabled ? {} : buttonAnimation)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

import { type ButtonHTMLAttributes } from "react";

type CardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
    <button
      type="button"
      className={`
        p-6 rounded-2xl text-left w-full
        transition-all duration-200
        border-2 shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-white text-stone-800 border-stone-200 hover:border-emerald-300 hover:shadow-xl"
        }
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

import { type ButtonHTMLAttributes } from "react";

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false, disabled, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={`
        px-4 py-2 rounded-full
        font-medium text-sm
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
      {...props}
    >
      {label}
    </button>
  );
}

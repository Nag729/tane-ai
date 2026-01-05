import { type HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-lg border-2 border-stone-200 p-4 sm:p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

import { type HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-lg border border-stone-200 p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

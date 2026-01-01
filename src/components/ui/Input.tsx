import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

const baseStyles = `
  w-full px-4 py-3 rounded-xl
  border-2
  focus:outline-none focus:ring-2
  transition-all duration-200
  text-stone-800
  placeholder:text-stone-400
`;

const normalStyles = "border-stone-300 bg-white focus:border-emerald-500 focus:ring-emerald-100";
const errorStyles = "border-rose-400 bg-rose-50 focus:border-rose-400 focus:ring-rose-100";

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        ${baseStyles}
        ${error ? errorStyles : normalStyles}
        ${className}
      `}
      {...props}
    />
  );
}

export function Textarea({ error, className = "", rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      className={`
        ${baseStyles}
        resize-none
        ${error ? errorStyles : normalStyles}
        ${className}
      `}
      rows={rows}
      {...props}
    />
  );
}

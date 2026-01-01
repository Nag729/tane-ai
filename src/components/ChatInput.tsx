import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type ChatInputProps = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ChatInput({
  onSubmit,
  placeholder = "自由に入力してください...",
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label="送信"
      >
        送信
      </Button>
    </div>
  );
}

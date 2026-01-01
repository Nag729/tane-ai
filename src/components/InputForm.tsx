import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type InputFormData = {
  purpose: string;
  recipient: string;
  background: string;
};

type InputFormProps = {
  onSubmit: (data: InputFormData) => void;
  isLoading?: boolean;
};

export function InputForm({ onSubmit, isLoading = false }: InputFormProps) {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [background, setBackground] = useState("");

  const isValid = purpose.trim() && recipient.trim() && background.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      purpose: purpose.trim(),
      recipient: recipient.trim(),
      background: background.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-stone-700 mb-2">
          🎯 目的
        </label>
        <Input
          id="purpose"
          placeholder="何を伝えたいですか？"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-stone-700 mb-2">
          👤 相手
        </label>
        <Input
          id="recipient"
          placeholder="例: マーケチームの田中さん（技術には詳しくない）"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="background" className="block text-sm font-medium text-stone-700 mb-2">
          📝 背景
        </label>
        <Textarea
          id="background"
          placeholder="ざっくり状況を教えてください"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={!isValid || isLoading} className="w-full">
        {isLoading ? "準備中..." : "始める 🚀"}
      </Button>
    </form>
  );
}

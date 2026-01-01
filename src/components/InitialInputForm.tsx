import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FieldConfig = {
  label: string;
  placeholder: string;
};

type InitialInputFormProps = {
  fields: {
    topic: FieldConfig;
    recipient: FieldConfig;
    detail: FieldConfig;
  };
  onSubmit: (data: { topic: string; recipient: string; detail: string }) => void;
  isLoading?: boolean;
};

export function InitialInputForm({
  fields,
  onSubmit,
  isLoading = false,
}: InitialInputFormProps) {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [detail, setDetail] = useState("");
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  const isValid = topic.trim() && recipient.trim() && detail.trim();

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    onSubmit({
      topic: topic.trim(),
      recipient: recipient.trim(),
      detail: detail.trim(),
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-stone-600 text-center text-sm">教えてね 📝</p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            {fields.topic.label}
          </label>
          <Textarea
            ref={firstInputRef}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={fields.topic.placeholder}
            rows={2}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            {fields.recipient.label}
          </label>
          <Textarea
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={fields.recipient.placeholder}
            rows={2}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            {fields.detail.label}
          </label>
          <Textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={fields.detail.placeholder}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? "準備中..." : "これで始める 🚀"}
        </Button>
      </form>
    </Card>
  );
}

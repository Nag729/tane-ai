import { useState, useRef, useEffect } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FieldConfig = { label: string; placeholder: string };
type InitialInputData = { topic: string; participant: string; detail: string };

type InitialInputFormProps = {
  fields: { topic: FieldConfig; participant: FieldConfig; detail: FieldConfig };
  onSubmit: (data: InitialInputData) => void;
  isLoading?: boolean;
  defaultValues?: InitialInputData;
};

export function InitialInputForm({
  fields,
  onSubmit,
  isLoading = false,
  defaultValues,
}: InitialInputFormProps) {
  const [topic, setTopic] = useState(defaultValues?.topic ?? "");
  const [participant, setParticipant] = useState(defaultValues?.participant ?? "");
  const [detail, setDetail] = useState(defaultValues?.detail ?? "");
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  const isValid = topic.trim() && participant.trim() && detail.trim();

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    onSubmit({ topic: topic.trim(), participant: participant.trim(), detail: detail.trim() });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-stone-600 text-center text-sm">最初にざっくり教えてください 📝</p>
        <FormField
          ref={firstInputRef}
          label={fields.topic.label}
          value={topic}
          onChange={setTopic}
          placeholder={fields.topic.placeholder}
        />
        <FormField
          label={fields.participant.label}
          value={participant}
          onChange={setParticipant}
          placeholder={fields.participant.placeholder}
        />
        <FormField
          label={fields.detail.label}
          value={detail}
          onChange={setDetail}
          placeholder={fields.detail.placeholder}
          rows={3}
        />
        <Button type="submit" disabled={!isValid || isLoading} className="w-full">
          {isLoading ? "準備中..." : "これで始める 🚀"}
        </Button>
      </form>
    </Card>
  );
}

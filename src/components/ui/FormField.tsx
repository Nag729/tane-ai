import { Textarea } from "@/components/ui/Input";
import { forwardRef } from "react";

export type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export const FormField = forwardRef<HTMLTextAreaElement, FormFieldProps>(
  ({ label, value, onChange, placeholder, rows = 2 }, ref) => {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700">{label}</label>
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      </div>
    );
  }
);

FormField.displayName = "FormField";

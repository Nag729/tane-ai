import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  component: FormField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

function FormFieldWithState(props: { label: string; placeholder?: string; rows?: number }) {
  const [value, setValue] = useState("");
  return <FormField {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <FormFieldWithState label="ラベル" placeholder="テキストを入力..." />,
};

export const WithValue: Story = {
  args: {
    label: "タイトル",
    value: "入力済みのテキスト",
    onChange: () => {},
    placeholder: "タイトルを入力",
  },
};

export const CustomRows: Story = {
  render: () => <FormFieldWithState label="詳細" placeholder="詳細を入力..." rows={5} />,
};

export const ShortLabel: Story = {
  render: () => <FormFieldWithState label="名前" placeholder="お名前を入力" rows={1} />,
};

export const LongLabel: Story = {
  render: () => (
    <FormFieldWithState
      label="このフィールドには長いラベルが設定されています"
      placeholder="入力してください..."
    />
  ),
};

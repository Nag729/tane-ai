"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { InputForm } from "@/components/InputForm";
import { Card } from "@/components/ui/Card";
import type { HorensoType } from "@/types";

const typeLabels: Record<HorensoType, { emoji: string; label: string }> = {
  report: { emoji: "📊", label: "報告" },
  contact: { emoji: "📢", label: "連絡" },
  consult: { emoji: "💭", label: "相談" },
};

function InputPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") as HorensoType | null;

  // type が無効な場合はトップに戻す
  if (!type || !["report", "contact", "consult"].includes(type)) {
    router.replace("/");
    return null;
  }

  const { emoji, label } = typeLabels[type];

  const handleSubmit = (data: {
    purpose: string;
    recipient: string;
    background: string;
  }) => {
    // URLパラメータでデータを渡す（セッション保存なしのため）
    const params = new URLSearchParams({
      type,
      purpose: data.purpose,
      recipient: data.recipient,
      background: data.background,
    });
    router.push(`/chat?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card className="text-center mb-6">
          <p className="text-4xl mb-2">{emoji}</p>
          <h1 className="text-2xl font-bold text-stone-800 mb-1">
            {label}の整理
          </h1>
          <p className="text-stone-600">まずは基本情報を教えてね</p>
        </Card>

        <Card>
          <InputForm onSubmit={handleSubmit} />
        </Card>

        <button
          onClick={() => router.back()}
          className="mt-4 w-full text-center text-stone-500 hover:text-stone-700 transition-colors"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}

export default function InputPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-stone-500">読み込み中...</p>
        </div>
      }
    >
      <InputPageContent />
    </Suspense>
  );
}

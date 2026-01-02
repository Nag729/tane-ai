"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TypeSelector } from "@/components/pages/home/TypeSelector";
import { Card } from "@/components/ui/Card";
import type { MeetingType } from "@/types";

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<MeetingType | undefined>();

  const handleSelect = (type: MeetingType) => {
    setSelected(type);
    setTimeout(() => {
      router.push(`/chat?type=${type}`);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* ヒーローセクション */}
        <Card className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">🌱 たねAI</h1>
          <p className="text-lg sm:text-xl text-stone-700 mb-2">会議のタネ、AIがまく</p>
          <p className="text-stone-500 text-sm sm:text-base">
            準備8割、会議2割。事前資料を一緒に作ろう
          </p>
        </Card>

        {/* 使い方の説明 */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm text-stone-500">
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">①</span> AIが質問
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">②</span> 答えるだけで
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">③</span> 資料完成
          </span>
        </div>

        {/* 種類選択 */}
        <div>
          <p className="text-center text-stone-600 mb-4">どんな会議？</p>
          <TypeSelector selected={selected} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}

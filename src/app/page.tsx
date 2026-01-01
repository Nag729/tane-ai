"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TypeSelector } from "@/components/TypeSelector";
import { Card } from "@/components/ui/Card";
import type { HorensoType } from "@/types";

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<HorensoType | undefined>();

  const handleSelect = (type: HorensoType) => {
    setSelected(type);
    setTimeout(() => {
      router.push(`/chat?type=${type}`);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">🥬 ほうれんそう AI</h1>
          <p className="text-stone-600">
            上司・同僚・クライアントへの
            <br />
            報連相をAIが一緒に整理するよ
          </p>
        </Card>

        <div className="mb-6">
          <p className="text-center text-stone-600 mb-4">何を整理したい？</p>
          <TypeSelector selected={selected} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}

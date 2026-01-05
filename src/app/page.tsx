"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TypeSelector } from "@/components/pages/home/TypeSelector";
import { Card } from "@/components/ui/Card";
import { fadeInUp, defaultTransition } from "@/lib/motion";
import type { MeetingType } from "@/types";

export default function Home() {
  const router = useRouter();

  const handleSelect = (type: MeetingType) => {
    router.push(`/chat?type=${type}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* ヒーローセクション */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={defaultTransition}
        >
          <Card className="text-center mb-8 shadow-paper">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">🍏 たねAI</h1>
            <p className="text-lg sm:text-xl text-stone-700 mb-2">会議のタネ、AIがまく</p>
            <p className="text-stone-500 text-sm sm:text-base">
              準備8割、会議2割。事前資料を一緒に作ろう
            </p>
          </Card>
        </motion.div>

        {/* 使い方の説明 */}
        <motion.div
          className="flex justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm text-stone-500"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...defaultTransition, delay: 0.1 }}
        >
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">①</span> AIの質問に
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">②</span> 答えるだけで
          </span>
          <span className="text-stone-300">→</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-500">③</span> 資料が完成！
          </span>
        </motion.div>

        {/* 種類選択 */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...defaultTransition, delay: 0.2 }}
        >
          <p className="text-center text-stone-600 mb-4">どんな会議？</p>
          <TypeSelector onSelect={handleSelect} />
        </motion.div>
      </div>
    </div>
  );
}

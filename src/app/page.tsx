"use client";

import { useRouter } from "nextjs-toploader/app";
import { motion } from "framer-motion";
import { TypeSelector } from "@/components/pages/home/TypeSelector";
import { GitHubLink } from "@/components/ui/GitHubLink";
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
          className="text-center mb-10"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={defaultTransition}
        >
          <div className="text-5xl mb-4">🍏</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">たねAI</h1>
          <p className="text-stone-600 text-sm sm:text-base">
            質問に答えるだけで、会議の準備ができます
          </p>
        </motion.div>

        {/* 種類選択 */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...defaultTransition, delay: 0.1 }}
        >
          <p className="text-center text-stone-500 text-sm mb-4">どんな会議？</p>
          <TypeSelector onSelect={handleSelect} />
        </motion.div>

        {/* GitHub リンク */}
        <motion.div
          className="mt-12 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...defaultTransition, delay: 0.2 }}
        >
          <GitHubLink href="https://github.com/Nag729/tane-ai" />
        </motion.div>
      </div>
    </div>
  );
}

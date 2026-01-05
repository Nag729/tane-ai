import type { Transition, Variants } from "framer-motion";

// 控えめなスプリング設定（任天堂風）
export const springBounce: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

// ボタン用のホバー・タップアニメーション
export const buttonAnimation = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springBounce,
};

// カードボタン用のホバー浮上アニメーション
export const cardButtonAnimation = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: springBounce,
};

// Chip用のアニメーション
export const chipAnimation = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: springBounce,
};

// フェードイン + 上からスライド
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// 左からスライドイン（AIメッセージ用）
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
};

// 右からスライドイン（ユーザーメッセージ用）
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
};

// スタガーコンテナ（子要素を順番に表示）
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// スタガー用の子要素
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// アニメーションのデフォルト transition
export const defaultTransition: Transition = {
  duration: 0.25,
  ease: "easeOut",
};

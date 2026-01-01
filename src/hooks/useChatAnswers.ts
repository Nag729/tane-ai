import { useState, useCallback, useMemo } from "react";
import type { AnswerState, Question, QuestionAnswer } from "@/types";

type UseChatAnswersReturn = {
  /** 質問ID → 回答状態のマップ */
  answers: Record<string, AnswerState>;
  /** 選択肢の変更ハンドラ */
  handleOptionChange: (questionId: string, selectedIds: string[]) => void;
  /** カスタム入力の変更ハンドラ */
  handleCustomInputChange: (questionId: string, value: string) => void;
  /** 特定の質問に有効な回答があるか */
  hasValidAnswer: (questionId: string) => boolean;
  /** 全ての質問に回答済みか判定 */
  checkAllAnswered: (questions: readonly Question[]) => boolean;
  /** 回答状態をリセット */
  resetAnswers: () => void;
  /** QuestionAnswer 配列を生成 */
  buildQuestionAnswers: (questions: readonly Question[]) => QuestionAnswer[];
};

/**
 * チャットの回答入力状態を管理するフック
 */
// eslint-disable-next-line max-lines-per-function
export function useChatAnswers(): UseChatAnswersReturn {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});

  const handleOptionChange = useCallback((questionId: string, selectedIds: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedIds,
        customInput: prev[questionId]?.customInput || "",
      },
    }));
  }, []);

  const handleCustomInputChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedIds: prev[questionId]?.selectedIds || [],
        customInput: value,
      },
    }));
  }, []);

  const hasValidAnswer = useCallback(
    (questionId: string) => {
      const answer = answers[questionId];
      if (!answer) return false;
      return answer.selectedIds.length > 0 || answer.customInput.trim() !== "";
    },
    [answers]
  );

  const checkAllAnswered = useCallback(
    (questions: readonly Question[]) => {
      if (questions.length === 0) return false;
      return questions.every((q) => hasValidAnswer(q.id));
    },
    [hasValidAnswer]
  );

  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const buildQuestionAnswers = useCallback(
    (questions: readonly Question[]): QuestionAnswer[] => {
      return questions
        .filter((q) => hasValidAnswer(q.id))
        .map((q) => ({
          questionId: q.id,
          selectedOptionIds: answers[q.id]?.selectedIds || [],
          customInput: answers[q.id]?.customInput?.trim() || undefined,
        }));
    },
    [answers, hasValidAnswer]
  );

  return useMemo(
    () => ({
      answers,
      handleOptionChange,
      handleCustomInputChange,
      hasValidAnswer,
      checkAllAnswered,
      resetAnswers,
      buildQuestionAnswers,
    }),
    [
      answers,
      handleOptionChange,
      handleCustomInputChange,
      hasValidAnswer,
      checkAllAnswered,
      resetAnswers,
      buildQuestionAnswers,
    ]
  );
}

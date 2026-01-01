import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useChatAnswers } from "./useChatAnswers";
import type { Question } from "@/types";

const mockQuestions: Question[] = [
  {
    id: "q1",
    content: "質問1",
    options: [
      { id: "opt1", label: "選択肢1" },
      { id: "opt2", label: "選択肢2" },
    ],
    multiSelect: false,
  },
  {
    id: "q2",
    content: "質問2",
    options: [
      { id: "opt3", label: "選択肢3" },
      { id: "opt4", label: "選択肢4" },
    ],
    multiSelect: true,
  },
];

describe("useChatAnswers", () => {
  // Given: useChatAnswers フックを初期化
  // When: レンダリングする
  // Then: 初期状態が正しい
  it("should have correct initial state", () => {
    const { result } = renderHook(() => useChatAnswers());

    expect(result.current.answers).toEqual({});
  });

  describe("handleOptionChange", () => {
    // Given: 初期状態
    // When: handleOptionChange を呼ぶ
    // Then: 選択肢が更新される
    it("should update selected options", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
      });

      expect(result.current.answers["q1"]?.selectedIds).toEqual(["opt1"]);
    });

    // Given: 既存のカスタム入力がある
    // When: handleOptionChange を呼ぶ
    // Then: カスタム入力が保持される
    it("should preserve custom input when changing options", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleCustomInputChange("q1", "カスタム入力");
        result.current.handleOptionChange("q1", ["opt1"]);
      });

      expect(result.current.answers["q1"]?.customInput).toBe("カスタム入力");
      expect(result.current.answers["q1"]?.selectedIds).toEqual(["opt1"]);
    });

    // Given: 複数選択の質問
    // When: 複数の選択肢を選ぶ
    // Then: 全ての選択肢が保存される
    it("should handle multiple selections", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q2", ["opt3", "opt4"]);
      });

      expect(result.current.answers["q2"]?.selectedIds).toEqual(["opt3", "opt4"]);
    });
  });

  describe("handleCustomInputChange", () => {
    // Given: 初期状態
    // When: handleCustomInputChange を呼ぶ
    // Then: カスタム入力が更新される
    it("should update custom input", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleCustomInputChange("q1", "テスト入力");
      });

      expect(result.current.answers["q1"]?.customInput).toBe("テスト入力");
    });

    // Given: 既存の選択肢がある
    // When: handleCustomInputChange を呼ぶ
    // Then: 選択肢が保持される
    it("should preserve selected options when changing custom input", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
        result.current.handleCustomInputChange("q1", "補足説明");
      });

      expect(result.current.answers["q1"]?.selectedIds).toEqual(["opt1"]);
      expect(result.current.answers["q1"]?.customInput).toBe("補足説明");
    });
  });

  describe("hasValidAnswer", () => {
    // Given: 選択肢が選ばれている
    // When: hasValidAnswer を呼ぶ
    // Then: true を返す
    it("should return true when option is selected", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
      });

      expect(result.current.hasValidAnswer("q1")).toBe(true);
    });

    // Given: カスタム入力がある
    // When: hasValidAnswer を呼ぶ
    // Then: true を返す
    it("should return true when custom input exists", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleCustomInputChange("q1", "入力あり");
      });

      expect(result.current.hasValidAnswer("q1")).toBe(true);
    });

    // Given: 何も入力されていない
    // When: hasValidAnswer を呼ぶ
    // Then: false を返す
    it("should return false when nothing is entered", () => {
      const { result } = renderHook(() => useChatAnswers());

      expect(result.current.hasValidAnswer("q1")).toBe(false);
    });

    // Given: カスタム入力が空白のみ
    // When: hasValidAnswer を呼ぶ
    // Then: false を返す
    it("should return false when custom input is only whitespace", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleCustomInputChange("q1", "   ");
      });

      expect(result.current.hasValidAnswer("q1")).toBe(false);
    });
  });

  describe("checkAllAnswered", () => {
    // Given: 全ての質問に回答済み
    // When: checkAllAnswered を呼ぶ
    // Then: true を返す
    it("should return true when all questions are answered", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
        result.current.handleOptionChange("q2", ["opt3"]);
      });

      expect(result.current.checkAllAnswered(mockQuestions)).toBe(true);
    });

    // Given: 一部の質問のみ回答済み
    // When: checkAllAnswered を呼ぶ
    // Then: false を返す
    it("should return false when not all questions are answered", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
      });

      expect(result.current.checkAllAnswered(mockQuestions)).toBe(false);
    });

    // Given: 質問がない
    // When: checkAllAnswered を呼ぶ
    // Then: false を返す
    it("should return false when no questions exist", () => {
      const { result } = renderHook(() => useChatAnswers());

      expect(result.current.checkAllAnswered([])).toBe(false);
    });
  });

  describe("resetAnswers", () => {
    // Given: 回答がある状態
    // When: resetAnswers を呼ぶ
    // Then: 全ての回答がクリアされる
    it("should clear all answers", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
        result.current.handleCustomInputChange("q2", "入力");
      });

      expect(Object.keys(result.current.answers).length).toBeGreaterThan(0);

      act(() => {
        result.current.resetAnswers();
      });

      expect(result.current.answers).toEqual({});
    });
  });

  describe("buildQuestionAnswers", () => {
    // Given: 回答がある
    // When: buildQuestionAnswers を呼ぶ
    // Then: QuestionAnswer 配列が返される
    it("should build question answers array", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1", "opt2"]);
        result.current.handleCustomInputChange("q1", "補足");
      });

      const answers = result.current.buildQuestionAnswers(mockQuestions);

      expect(answers).toHaveLength(1);
      expect(answers[0]).toEqual({
        questionId: "q1",
        selectedOptionIds: ["opt1", "opt2"],
        customInput: "補足",
      });
    });

    // Given: 回答がない質問がある
    // When: buildQuestionAnswers を呼ぶ
    // Then: 回答がある質問のみ返される
    it("should only include answered questions", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
        // q2 は回答なし
      });

      const answers = result.current.buildQuestionAnswers(mockQuestions);

      expect(answers).toHaveLength(1);
      expect(answers[0].questionId).toBe("q1");
    });

    // Given: カスタム入力が空白のみ
    // When: buildQuestionAnswers を呼ぶ
    // Then: customInput が undefined になる
    it("should set customInput to undefined when only whitespace", () => {
      const { result } = renderHook(() => useChatAnswers());

      act(() => {
        result.current.handleOptionChange("q1", ["opt1"]);
        result.current.handleCustomInputChange("q1", "   ");
      });

      const answers = result.current.buildQuestionAnswers(mockQuestions);

      expect(answers[0].customInput).toBeUndefined();
    });
  });
});

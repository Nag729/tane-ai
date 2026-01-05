/** 会議の種類 */
export type MeetingType = "decision" | "share" | "discussion";

/** 補足ラベルの型（リテラル型で制限） */
export type SupplementLabel = "参加者" | "背景" | "制約" | "期限" | "ゴール";

/** 補足項目 */
export type Supplement = {
  readonly id: string;
  readonly label?: SupplementLabel;
  readonly value: string;
};

/** 初期入力データ */
export type InitialInputData = {
  readonly theme: string;
  readonly verb: string;
  readonly supplements: readonly Supplement[];
};

/**
 * チャットのフェーズ（状態遷移）
 *
 * idle → thinking → answering → thinking → ... → ready
 *                                                    ↓
 *                                             /result へ遷移
 */
export type ChatPhase =
  | "idle" // 初期状態（初期入力待ち）
  | "thinking" // API呼び出し中（Extended Thinking）
  | "answering" // 質問表示、回答待ち
  | "ready"; // 準備完了、「完成！」ボタン表示可能

/** 質問の選択肢 */
export type QuestionOption = {
  readonly id: string;
  readonly label: string;
};

/** 個別の質問 */
export type Question = {
  readonly id: string;
  readonly content: string;
  readonly options: readonly QuestionOption[];
  readonly multiSelect: boolean;
  /** 自由入力のプレースホルダー */
  readonly customInputPlaceholder?: string;
};

/** AI からのメッセージ（複数の質問を含む） */
export type AIMessage = {
  readonly id: string;
  readonly intro?: string;
  readonly questions: readonly Question[];
};

/** 個別の質問への回答 */
export type QuestionAnswer = {
  readonly questionId: string;
  readonly selectedOptionIds: readonly string[];
  /** 質問ごとの自由入力 */
  readonly customInput?: string;
};

/** ユーザーの回答（複数の質問への回答 + カスタム入力） */
export type UserAnswer = {
  readonly messageId: string;
  readonly answers: readonly QuestionAnswer[];
  readonly customInput?: string;
};

/** 対話メッセージ（Discriminated Union） */
export type ChatMessage =
  | { readonly role: "ai"; readonly message: AIMessage }
  | { readonly role: "user"; readonly answer: UserAnswer };

/** 質問への回答状態（入力中） */
export type AnswerState = {
  selectedIds: string[];
  customInput: string;
};

/** 構造化された出力（Markdown形式） */
export type StructuredOutput = {
  readonly content: string;
};

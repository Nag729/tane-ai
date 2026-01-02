/** 会議の種類 */
export type MeetingType = "decision" | "share" | "discussion";

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

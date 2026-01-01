/** ほうれんそうの種類 */
export type HorensoType = "report" | "contact" | "consult";

/** 初期入力データ */
export type InitialInput = {
  type: HorensoType;
  purpose: string;
  recipient: string;
  background: string;
};

/** 質問の選択肢 */
export type QuestionOption = {
  id: string;
  label: string;
};

/** 個別の質問 */
export type Question = {
  id: string;
  content: string;
  options: QuestionOption[];
  multiSelect: boolean;
  /** 自由入力のプレースホルダー */
  customInputPlaceholder?: string;
};

/** AI からのメッセージ（複数の質問を含む） */
export type AIMessage = {
  id: string;
  intro?: string;
  questions: Question[];
};

/** 個別の質問への回答 */
export type QuestionAnswer = {
  questionId: string;
  selectedOptionIds: string[];
  /** 質問ごとの自由入力 */
  customInput?: string;
};

/** ユーザーの回答（複数の質問への回答 + カスタム入力） */
export type UserAnswer = {
  messageId: string;
  answers: QuestionAnswer[];
  customInput?: string;
};

/** 対話メッセージ */
export type ChatMessage =
  | { role: "ai"; message: AIMessage }
  | { role: "user"; answer: UserAnswer };

/** 対話状態 */
export type ChatState = {
  messages: ChatMessage[];
  isComplete: boolean;
  isLoading: boolean;
};

/** 構造化された出力 */
export type StructuredOutput = {
  /** Markdown形式（Slack, GitHub, Notion向け） */
  markdown: string;
  /** プレーンテキスト形式（メール向け、Markdown構文なし） */
  plaintext: string;
};

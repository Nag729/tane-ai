/** ほうれんそうの種類 */
export type HorensoType = "report" | "contact" | "consult";

/** 初期入力データ */
export type InitialInput = {
  type: HorensoType;
  purpose: string;
  recipient: string;
  background: string;
};

/** AI からの質問 */
export type AIQuestion = {
  id: string;
  content: string;
  options: QuestionOption[];
  multiSelect: boolean;
};

/** 質問の選択肢 */
export type QuestionOption = {
  id: string;
  label: string;
};

/** ユーザーの回答 */
export type UserAnswer = {
  questionId: string;
  selectedOptionIds: string[];
  customInput?: string;
};

/** 対話メッセージ */
export type ChatMessage =
  | { role: "ai"; question: AIQuestion }
  | { role: "user"; answer: UserAnswer };

/** 対話状態 */
export type ChatState = {
  messages: ChatMessage[];
  isComplete: boolean;
  isLoading: boolean;
};

/** 構造化された出力 */
export type StructuredOutput = {
  content: string;
  format: "markdown" | "plaintext";
};

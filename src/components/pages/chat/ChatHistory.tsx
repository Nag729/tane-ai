import { AIMessageBubble } from "@/components/projects/AIMessageBubble";
import { UserMessageBubble } from "@/components/projects/UserMessageBubble";
import type { ChatMessage } from "@/types";

export type ChatHistoryProps = {
  /** チャットメッセージの配列 */
  messages: ChatMessage[];
  /** ユーザー回答の表示文字列を取得する関数 */
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
};

export function ChatHistory({ messages, getAnswerDisplay }: ChatHistoryProps) {
  return (
    <>
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.role === "ai" ? (
            <div className="space-y-3">
              {msg.message.intro && <AIMessageBubble content={msg.message.intro} />}
            </div>
          ) : (
            <UserMessageBubble content={getAnswerDisplay(msg)} />
          )}
        </div>
      ))}
    </>
  );
}

import { AIMessageBubble } from "@/components/AIMessageBubble";
import { UserMessageBubble } from "@/components/UserMessageBubble";
import type { ChatMessage } from "@/types";

export type ChatHistoryProps = {
  /** チャットメッセージの配列 */
  messages: ChatMessage[];
  /** ユーザー回答の表示文字列を取得する関数 */
  getAnswerDisplay: (chatMessage: ChatMessage) => string;
  /** ローディング中かどうか */
  isLoading: boolean;
};

export function ChatHistory({ messages, getAnswerDisplay, isLoading }: ChatHistoryProps) {
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
      {isLoading && <AIMessageBubble content="..." isStreaming={true} />}
    </>
  );
}

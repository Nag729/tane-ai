import type { MeetingType, ChatMessage, StructuredOutput } from "@/types";

const STORAGE_KEY = "tane-chat-data";

export type ChatData = {
  type: MeetingType;
  messages: ChatMessage[];
  output?: StructuredOutput;
};

export function saveChatData(data: ChatData) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadChatData(): ChatData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ChatData;
  } catch {
    return null;
  }
}

export function clearChatData() {
  sessionStorage.removeItem(STORAGE_KEY);
}

import { describe, it, expect, beforeEach } from "vitest";
import { saveChatData, loadChatData, clearChatData, ChatData } from "./chatStorage";

describe("chatStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const mockChatData: ChatData = {
    type: "decision",
    messages: [
      {
        role: "ai",
        message: {
          id: "msg-1",
          intro: "テスト",
          questions: [],
        },
      },
    ],
  };

  describe("saveChatData", () => {
    // Given: ChatData がある
    // When: saveChatData を呼び出す
    // Then: sessionStorage に保存される
    it("should save data to sessionStorage", () => {
      saveChatData(mockChatData);
      const stored = sessionStorage.getItem("tane-chat-data");
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(mockChatData);
    });
  });

  describe("loadChatData", () => {
    // Given: sessionStorage にデータがある
    // When: loadChatData を呼び出す
    // Then: データが返される
    it("should load data from sessionStorage", () => {
      sessionStorage.setItem("tane-chat-data", JSON.stringify(mockChatData));
      const result = loadChatData();
      expect(result).toEqual(mockChatData);
    });

    // Given: sessionStorage にデータがない
    // When: loadChatData を呼び出す
    // Then: null が返される
    it("should return null when no data exists", () => {
      const result = loadChatData();
      expect(result).toBeNull();
    });

    // Given: sessionStorage に不正な JSON がある
    // When: loadChatData を呼び出す
    // Then: null が返される
    it("should return null when invalid JSON exists", () => {
      sessionStorage.setItem("tane-chat-data", "invalid json");
      const result = loadChatData();
      expect(result).toBeNull();
    });
  });

  describe("clearChatData", () => {
    // Given: sessionStorage にデータがある
    // When: clearChatData を呼び出す
    // Then: データが削除される
    it("should remove data from sessionStorage", () => {
      sessionStorage.setItem("tane-chat-data", JSON.stringify(mockChatData));
      clearChatData();
      expect(sessionStorage.getItem("tane-chat-data")).toBeNull();
    });
  });
});

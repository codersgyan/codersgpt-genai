import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { create } from "zustand";

export interface ChatStoreState {
  chatInstance: Chat<UIMessage>;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
}

function createChat() {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({
        id,
        messages,
        messageId,
        body,
      }) => {
        const lastMessage = messages.slice(-1);

        let lastMessageText = "";

        const part = lastMessage[0]?.parts?.[0];
        if (part?.type === "text") {
          lastMessageText = part.text;
        }

        return {
          body: {
            messageContent: lastMessageText,
            threadId: body?.threadId,
            selectedModel: body?.selectedModel,
          },
        };
      },
    }),
  });
}

export const useChatStore = create<ChatStoreState>(
  (set) => ({
    chatInstance: createChat(),
    selectedModel: "gpt-5-mini",
    setSelectedModel: (modelId) => {
      set({ selectedModel: modelId });
    },
  }),
);

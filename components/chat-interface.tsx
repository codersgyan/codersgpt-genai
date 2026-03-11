"use client";

import { useChat } from "@ai-sdk/react";
import InputContainer from "./input-container";
import { useChatStore } from "@/store/chat-store";
import MessageRenderer from "./message-renderer";
import { StoredMessage } from "@langchain/core/messages";
import { convertLangChainToUI } from "@/lib/converters";

export const ChatInterfaceNew = ({
  oldMessages,
}: {
  oldMessages: StoredMessage[];
}) => {
  const { chatInstance } = useChatStore();

  const convertedOldMessages =
    convertLangChainToUI(oldMessages);

  console.log({ convertedOldMessages });

  const { messages } = useChat({ chat: chatInstance });

  return (
    <>
      {messages.length === 0 &&
      convertedOldMessages.length === 0 ? (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
          <main className="h-full flex flex-col items-center  justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
            <h1 className="text-3xl font-normal mb-8 tracking-tight text-white">
              What can I help with ?
            </h1>
            <InputContainer />
          </main>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-hidden">
          <div className="flex flex-col h-full w-full">
            <div className="flex-1 min-h-0">
              <MessageRenderer
                messages={convertedOldMessages}
              />
              <MessageRenderer messages={messages} />
            </div>

            <div>
              <InputContainer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

"use client";

import { useChat } from "@ai-sdk/react";
import InputContainer from "./input-container";
import { useChatStore } from "@/store/chat-store";

export const ChatInterfaceNew = () => {
  const { chatInstance } = useChatStore();

  const { messages } = useChat({ chat: chatInstance });

  console.log("messages", messages);

  return (
    <>
      {messages.length === 0 ? (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
          <main className="h-full flex flex-col items-center  justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
            <h1 className="text-3xl font-normal mb-8 tracking-tight text-white">
              What can I help with ?
            </h1>
            <InputContainer />
          </main>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
          <main className="h-full flex flex-col items-center  justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
            {messages.map((message) => (
              <h1>{message.parts[0].text}</h1>
            ))}
            <InputContainer />
          </main>
        </div>
      )}
    </>
  );
};

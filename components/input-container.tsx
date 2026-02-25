"use client";

import { v4 as uuidv4 } from "uuid";
import { useParams, useRouter } from "next/navigation";
import { Plus, AudioLines, ArrowUp } from "lucide-react";

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";

function InputContainer() {

  return (
    <div className="flex flex-col items-center w-full max-w-200 mx-auto pb-6">
      <PromptInput
        className="w-full bg-[#2f2f2f] rounded-[32px]"
        onSubmit={(message) => {
          console.log(message);
        }}
      >
        <PromptInputBody className="flex items-end w-full">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#b4b4b4] hover:bg-[#3f3f3f] transition-colors mb-0.5"
          >
            <Plus size={24} strokeWidth={1.5} />
          </button>

          <div className="flex-1 min-w-0 items-center justify-center w-full h-full">
            <PromptInputTextarea
              onChange={(e) => {}}
              value={""}
              placeholder="Ask anything"
              className="w-full flex items-center justify-center bg-transparent border-none focus:ring-0 focus-visible:ring-0 py-3 text-[18px] text-zinc-100 placeholder:text-[#676767] resize-none min-h-11 max-h-50 leading-tight"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 mb-0.5">
            <SpeechInput
              className="shrink-0  h-10 w-10 bg-transparent text-white"
              onTranscriptionChange={(text) => {
                
              }}
              size="icon-lg"
              variant="ghost"
            />

            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black hover:bg-[#ececec] transition-all"
            >
              <ArrowUp />
            </button>
          </div>
        </PromptInputBody>
      </PromptInput>
    </div>
  );
}

export default InputContainer;

"use client";


import InputContainer from "./input-container";

export const ChatInterfaceNew = () => {
  return (
    <>
      <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
        <main className="h-full flex flex-col items-center  justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
          <h1 className="text-3xl font-normal mb-8 tracking-tight text-white">
            What can I help with ?
          </h1>
          <InputContainer />
        </main>
      </div>
    </>
  );
};

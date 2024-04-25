"use client";

import ChatBotToggler from "@/components/chatbotToggler";
import Chatbot from "@/components/chatbot";
import { createContext, useRef } from "react";

export const AppContext = createContext(null);

export default function Home() {
  const toogleRef = useRef(null);
  return (
    <main ref={toogleRef}>
      <AppContext.Provider
        value={{
          toogleRef,
        }}
      >
        <ChatBotToggler />
        <Chatbot />
      </AppContext.Provider>
    </main>
  );
}

"use client";

import { AppContext } from "@/app/page";
import { useContext } from "react";

export default function ChatBotToggler() {
  const { toogleRef } = useContext(AppContext);

  const handleClick = () => {
    toogleRef.current.classList.toggle("show-chatbot");
  };
  return (
    <button className="chatbot-toggler" onClick={handleClick}>
      <span className="material-symbols-rounded">mode_comment</span>
      <span className="material-symbols-outlined">close</span>
    </button>
  );
}

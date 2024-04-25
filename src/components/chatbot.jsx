"use client";

import { AppContext } from "@/app/page";
import { useContext } from "react";
import style from "@/app/globals.css";

export default function Chatbot() {
  const { toogleRef } = useContext(AppContext);

  const handleClick = () => {
    toogleRef.current.classList.toggle("show-chatbot");
  };
  return (
    <div className="chatbot">
      <div className="header-chat">
        <h2>Assistant</h2>
        <span className="close-btn material-symbols-outlined" onClick={handleClick}>
          close
        </span>
      </div>
      <ul className="chatbox">
        <li className="chat incoming">
          <span className="material-symbols-outlined">smart_toy</span>
          <p>Hi ada yang bisa dibantu?</p>
        </li>
      </ul>
      <div className="chat-input">
        <textarea placeholder="Enter a message..." spellCheck="false" required></textarea>
        <span id="send-btn" className="material-symbols-rounded">
          send
        </span>
      </div>
    </div>
  );
}

"use client";

import { AppContext } from "@/app/page";
import { useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/Initialize";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import PostNotification from "@/api/postNotification";

export default function Chatbot() {
  const { toogleRef } = useContext(AppContext);
  const refInput = useRef(null);
  const [sesiUid, setsesiUid] = useState("");
  const [resultMessage, setResultMessage] = useState([]);
  const [deviceToken, setDeviceToken] = useState([]);
  const refChatBox = useRef(null);

  // useEffect(() => {
  //   const chatInput = document.querySelector(".chat-input textarea");
  //   const inputInitHeight = chatInput.scrollHeight;
  //   chatInput.addEventListener("input", () => {
  //     // Adjust the height of the input textarea based on its content
  //     chatInput.style.height = `${inputInitHeight}px`;
  //     chatInput.style.height = `${chatInput.scrollHeight}px`;
  //   });
  // }, []);

  const handleClick = () => {
    toogleRef.current.classList.toggle("show-chatbot");
  };

  const handleClickSendMessage = async (e) => {
    const timestamp = Date.now();

    const userMessage = refInput.current.value.trim();

    if (!userMessage) return;

    // Mengakses koleksi 'chat' di Firestore
    const citiesRef = collection(db, "chat");

    const ipDocRef = doc(citiesRef, `${sesiUid}`);

    const message = collection(ipDocRef, "message");

    const docRef = addDoc(message, {
      user: "web",
      message: refInput.current.value,
      timestamp: timestamp,
    });

    const time = setDoc(ipDocRef, {
      status: 1,
      timestamp: timestamp,
    });

    const responseNotif = PostNotification({ deviceToken: deviceToken, title: "FaceChat", message: "Pesan baru" });
    const [a, b, c] = await Promise.all([docRef, time, responseNotif]);

    if (c.status == 200) {
      console.log("notif sukses");
    }
    refInput.current.value = "";
    refChatBox.current.scrollTo(0, refChatBox.current.scrollHeight);
    console.log("firebase message", a.id);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
      event.preventDefault();
      handleClickSendMessage();
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      // Jika sudah tersimpan, gunakan ID sesi yang sudah ada
      setsesiUid(storedSessionId);
    } else {
      // Jika belum tersimpan, buat ID sesi baru
      const newSessionId = uuidv4(); // Membuat ID sesi baru menggunakan UUID
      setsesiUid(newSessionId);
      // Simpan ID sesi ke local storage agar dapat digunakan kembali saat aplikasi dimuat ulang
      localStorage.setItem("sessionId", newSessionId);
    }
  }, []);

  useEffect(() => {
    if (sesiUid) {
      const collectChat = collection(db, "chat");
      const docIp = doc(collectChat, sesiUid);
      const message = collection(docIp, "message");
      const unsubscribe = onSnapshot(query(message, orderBy("timestamp", "asc")), (snapshot) => {
        const newMessages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newMessages.push({ user: data.user, message: data.message, timestamp: data.timestamp });
          console.log("fire", data);
        });
        setResultMessage(newMessages); // Menetapkan kembali state dengan array baru yang berisi item baru
      });

      return () => {
        unsubscribe();
      };
    }
  }, [sesiUid]);

  useEffect(() => {
    const collectDevice = collection(db, "device");
    const token = onSnapshot(collectDevice, (snapshot) => {
      const device = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        device.push(data.token);
      });
      setDeviceToken(device);
    });

    return () => {
      token();
    };
  }, []);

  console.log("resut", resultMessage);

  return (
    <div className="chatbot">
      <div className="header-chat">
        <h2>Assistant</h2>
        <span className="close-btn material-symbols-outlined" onClick={handleClick}>
          close
        </span>
      </div>
      <ul className="chatbox" ref={refChatBox}>
        <li className="chat incoming">
          <span className="material-symbols-outlined">smart_toy</span>
          <p>Hi ada yang bisa dibantu?</p>
        </li>
        {resultMessage.map((data, i) => {
          if (data.user === "web") {
            return (
              <li className="chat outgoing" key={i}>
                <p>
                  {data.message} <br />
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "white",
                    }}
                  >
                    {(() => {
                      let date = new Date(data.timestamp);

                      const formattedDate = format(date, "dd/MM/yyyy HH:mm");

                      return formattedDate;
                    })()}
                  </div>
                </p>
              </li>
            );
          } else {
            return (
              <li className="chat incoming" key={i}>
                <span className="material-symbols-outlined">smart_toy</span>
                <p>
                  {data.message} <br />
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "#724ae8",
                    }}
                  >
                    {(() => {
                      let date = new Date(data.timestamp);

                      const formattedDate = format(date, "dd/MM/yyyy HH:mm");

                      return formattedDate;
                    })()}
                  </div>
                </p>
              </li>
            );
          }
        })}
      </ul>
      <div className="chat-input">
        <textarea placeholder="Enter a message..." spellCheck="false" required ref={refInput} onKeyDown={handleKeyPress}></textarea>
        <span id="send-btn" className="material-symbols-rounded" onClick={handleClickSendMessage}>
          send
        </span>
      </div>
    </div>
  );
}

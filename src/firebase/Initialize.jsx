import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.NEXT_FIREBASE_APIKEY}`,
  authDomain: "chat-67e63.firebaseapp.com",
  projectId: "chat-67e63",
  storageBucket: "chat-67e63.appspot.com",
  messagingSenderId: "241562056764",
  appId: "1:241562056764:web:bb76779e56362acd972b39",
  measurementId: "G-NBM5JSYZZN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRv1W1_fKQ-X_59icf0m7mNFJLYEUNYKU",
  authDomain: "party-qr-reader.firebaseapp.com",
  databaseURL:
    "https://party-qr-reader-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "party-qr-reader",
  storageBucket: "party-qr-reader.appspot.com",
  messagingSenderId: "676096698698",
  appId: "1:676096698698:web:fd484a4e2285c01a8339b3",
  measurementId: "G-BXCTTQ57L8",
};
export const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const fs = getFirestore(app);
export { db, fs };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

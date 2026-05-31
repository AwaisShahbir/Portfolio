import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzy9V4ZOdzatM8N5TZ1PXPa7Ha-GAxsKw",
  authDomain: "portfolio-a63a3.firebaseapp.com",
  projectId: "portfolio-a63a3",
  storageBucket: "portfolio-a63a3.firebasestorage.app",
  messagingSenderId: "54615898299",
  appId: "1:54615898299:web:21d621d93dc996a05a119e",
  measurementId: "G-D00TGWR2KK"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});

export default app;

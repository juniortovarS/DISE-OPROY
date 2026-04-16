import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCt3QEeI3SeqXO3V2Tkl2Iou4Yhuu74k-k",
  authDomain: "control-gastos-pro.firebaseapp.com",
  projectId: "control-gastos-pro",
  storageBucket: "control-gastos-pro.appspot.com",
  messagingSenderId: "376967805223",
  appId: "1:376967805223:web:c2254fb4957545b8cdd102"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 ESTO ES LO NUEVO
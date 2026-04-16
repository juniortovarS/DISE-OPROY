import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "/dashboard";
  } catch (error) {
    console.log(error.code);
    alert("Credenciales incorrectas");
  }
};
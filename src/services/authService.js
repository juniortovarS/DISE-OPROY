import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.log(error.code);
    return { success: false, error: error.code };
  }
};
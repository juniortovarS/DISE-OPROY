import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondoback.jpg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      let userCredential;

      // 🔐 REGISTRO
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Cuenta creada correctamente");
      }

      // 🔐 LOGIN
      else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = userCredential.user;

      // ✅ 🔥 SOLO AGREGADO (NO TOCA TU LÓGICA)
      localStorage.setItem("email", user.email);
      localStorage.setItem("uid", user.uid);

      // 👑 ROLE SIMPLE (SIN FIRESTORE)
      let role = "user";

      if (user.email === "admin@gmail.com") {
        role = "admin";
      }

      // 💾 opcional: guardar local
      localStorage.setItem("role", role);
      localStorage.setItem("email", user.email);

      // 🚀 REDIRECCIÓN
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log(error.code);

      if (error.code === "auth/user-not-found") {
        alert("Usuario no existe");
      } else if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta");
      } else if (error.code === "auth/invalid-credential") {
        alert("Credenciales inválidas");
      } else {
        alert("Error de autenticación");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>
          {isRegister ? "🧾 Crear cuenta" : "💰 Iniciar sesión"}
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAuth} style={styles.button}>
          {loading
            ? "Cargando..."
            : isRegister
            ? "Crear cuenta"
            : "Ingresar"}
        </button>

        <p
          style={styles.toggle}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿Eres nuevo? Crea una cuenta"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: 350,
    padding: 30,
    borderRadius: 15,
    background: "rgba(0,0,0,0.65)",
    color: "white",
    backdropFilter: "blur(10px)",
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 10,
    marginTop: 15,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  toggle: {
    cursor: "pointer",
    marginTop: 15,
    color: "#93c5fd",
    textAlign: "center",
  },

  link: {
    cursor: "pointer",
    marginTop: 10,
    color: "#60a5fa",
    textAlign: "center",
  },
};
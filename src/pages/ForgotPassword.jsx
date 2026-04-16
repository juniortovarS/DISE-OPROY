import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondoback.jpg";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSend = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    setStatus("loading");

    const result = await resetPassword(email);

    if (result.success) {
      setStatus("success");
      setMessage("Te enviamos un enlace a tu correo para restablecer tu contraseña");
    } else {
      setStatus("error");

      if (result.error === "auth/user-not-found") {
        setMessage("No existe una cuenta con este correo");
      } else if (result.error === "auth/invalid-email") {
        setMessage("Correo inválido");
      } else {
        setMessage("Error enviando el correo. Intenta nuevamente");
      }
    }
  };

  return (
    <div style={styles.bg}>

      <div style={styles.card}>
        <h2>🔐 Recuperar contraseña</h2>

        <p>
          Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu contraseña.
        </p>

        <input
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button style={styles.button} onClick={handleSend}>
          Enviar enlace
        </button>

        <p style={styles.link} onClick={() => navigate("/")}>
          Volver al login
        </p>
      </div>

      {/* POPUP PROFESIONAL */}
      {status !== "idle" && (
        <div style={styles.popup}>
          <div style={styles.popupBox}>

            {status === "loading" && <p>⏳ Enviando enlace seguro...</p>}

            {status === "success" && (
              <>
                <h3>✅ Enviado</h3>
                <p>{message}</p>
              </>
            )}

            {status === "error" && (
              <>
                <h3>❌ Error</h3>
                <p>{message}</p>
              </>
            )}

            <button onClick={() => setStatus("idle")}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  bg: {
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 420,
    padding: 30,
    borderRadius: 16,
    background: "rgba(0,0,0,0.65)",
    color: "white",
    backdropFilter: "blur(12px)",
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    cursor: "pointer",
    marginTop: 12,
    color: "#60a5fa",
    textAlign: "center",
  },
  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    background: "#0f172a",
    padding: 25,
    borderRadius: 14,
    color: "white",
    width: 320,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
};
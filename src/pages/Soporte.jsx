import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Soporte() {
  const [menu, setMenu] = useState(false);

  const email = "juniorTovar601@gmail.com";

  return (
    <div style={styles.page}>

      <button style={styles.menuBtn} onClick={() => setMenu(true)}>
        ☰
      </button>

      <Sidebar open={menu} setOpen={setMenu} />

      <h1 style={styles.title}>🆘 Soporte Técnico</h1>

      {/* 📌 ERRORES COMUNES */}
      <div style={styles.card}>
        <h3>⚠️ Posibles errores comunes</h3>

        <p style={styles.text}>
          Si la aplicación no funciona correctamente, puede deberse a problemas
          de almacenamiento local (localStorage), datos corruptos o errores al
          registrar movimientos sin fecha o monto válido.
        </p>

        <p style={styles.text}>
          También puede ocurrir que el navegador esté bloqueando funciones como
          descarga de archivos Excel o que existan datos antiguos guardados
          con estructura diferente a la versión actual del sistema.
        </p>

        <p style={styles.text}>
          En caso de ver valores como "00/00/0000" o "00:00", significa que los
          registros anteriores no tienen fecha/hora válida y deben actualizarse
          o eliminarse para evitar inconsistencias.
        </p>
      </div>

      {/* ❓ FAQ */}
      <div style={styles.card}>
        <h3>❓ Preguntas frecuentes</h3>

        <p style={styles.question}>🔹 ¿Por qué no se guardan mis movimientos?</p>
        <p style={styles.answer}>
          Verifica que el navegador no esté en modo incógnito y que localStorage esté habilitado.
        </p>

        <p style={styles.question}>🔹 ¿Por qué el Excel sale vacío o con datos raros?</p>
        <p style={styles.answer}>
          Probablemente tienes datos antiguos sin fecha/hora. Debes limpiar localStorage.
        </p>

        <p style={styles.question}>🔹 ¿Se pierden mis datos al cerrar la app?</p>
        <p style={styles.answer}>
          No, los datos se guardan en el navegador (localStorage), pero si lo limpias se borran.
        </p>

        <p style={styles.question}>🔹 ¿Cómo contacto soporte?</p>
        <p style={styles.answer}>
          Puedes escribirme directamente al correo de soporte que está abajo.
        </p>
      </div>

      {/* 📧 CONTACTO */}
      <div style={styles.card}>
        <h3>📧 Contacto de soporte</h3>

        <p style={styles.text}>
          Si tienes problemas, errores o mejoras que quieras sugerir, puedes escribirme directamente.
        </p>

        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Soporte%20App%20Finanzas&body=Hola,%20tengo%20un%20problema%20con%20la%20aplicación...`}
          target="_blank"
          rel="noreferrer"
          style={styles.email}
        >
          ✉️ Enviar correo a: {email}
        </a>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f19",
    color: "white",
    padding: 20,
    fontFamily: "Arial",
  },

  menuBtn: {
    position: "fixed",
    top: 15,
    left: 15,
    width: 45,
    height: 45,
    borderRadius: 10,
    background: "#111827",
    color: "white",
    border: "none",
    fontSize: 20,
  },

  title: {
    marginLeft: 60,
  },

  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    lineHeight: 1.6,
  },

  text: {
    marginBottom: 10,
    color: "#d1d5db",
  },

  question: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#93c5fd",
  },

  answer: {
    marginBottom: 10,
    color: "#d1d5db",
  },

  email: {
    display: "inline-block",
    marginTop: 10,
    padding: "10px 14px",
    background: "#22c55e",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: "bold",
  },
};
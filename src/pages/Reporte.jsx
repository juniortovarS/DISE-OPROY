import { useState } from "react";
import Sidebar from "../components/Sidebar";
import * as XLSX from "xlsx";

export default function Reporte() {
  const [menu, setMenu] = useState(false);

  const movimientos =
    JSON.parse(localStorage.getItem("movimientos")) || [];

  const exportExcel = () => {
    if (!movimientos.length) {
      alert("No hay movimientos para exportar");
      return;
    }

 const data = movimientos.map((m) => ({
  Descripcion: m.desc,
  Tipo: m.tipo,
  Monto: m.monto,

  Fecha:
    m.fecha ||
    m.date ||
    new Date(m.id || Date.now()).toLocaleDateString("es-PE"),

  Hora:
    m.hora ||
    m.time ||
    new Date(m.id || Date.now()).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
}));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");

    // 💡 nombre dinámico sugerido
    const fileName = `reporte-financiero-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={styles.page}>

      <button style={styles.menuBtn} onClick={() => setMenu(true)}>
        ☰
      </button>

      <Sidebar open={menu} setOpen={setMenu} />

      <h1 style={styles.title}>📄 Reporte Financiero</h1>

      {/* 📌 MÁS CONTENIDO (COMO PEDISTE) */}
      <div style={styles.card}>
        <h3>📌 ¿Qué es este reporte?</h3>
        <p>
          Este módulo te permite exportar toda tu información financiera en un archivo Excel profesional.
          Incluye ingresos, gastos, fechas y horas exactas de cada movimiento registrado en el sistema.
        </p>
        <p>
          Está diseñado para ayudarte a tener control total de tu dinero y llevar un registro claro de tu vida financiera.
        </p>
      </div>

      <div style={styles.card}>
        <h3>⚙️ ¿Cómo funciona?</h3>
        <p>
          El sistema toma automáticamente los datos guardados en tu dashboard.
          Luego los organiza en columnas estructuradas como: descripción, tipo, monto, fecha y hora.
        </p>
        <p>
          Finalmente genera un archivo Excel listo para abrir en Microsoft Excel o Google Sheets.
        </p>
      </div>

      <div style={styles.card}>
        <h3>📊 ¿Para qué sirve?</h3>
        <p>
          Sirve para analizar tus hábitos financieros, detectar gastos excesivos y mejorar tu control económico.
        </p>
        <p>
          También puedes compartirlo o usarlo como respaldo de tus movimientos mensuales.
        </p>
      </div>

      <div style={styles.card}>
        <h3>📥 Exportación de datos</h3>
        <p>
          Al presionar el botón de descarga, se generará un archivo Excel con todos tus movimientos.
          El archivo incluirá fecha y hora real de cada registro.
        </p>
      </div>

      {/* BOTÓN */}
      <div style={styles.center}>
        <button onClick={exportExcel} style={styles.btn}>
          📥 Descargar Excel
        </button>
      </div>

      <div style={styles.note}>
        💡 Consejo: Descarga tu reporte cada semana para tener un mejor control de tus finanzas personales.
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
    lineHeight: 1.5,
  },

  center: {
    display: "flex",
    justifyContent: "center",
    marginTop: 25,
  },

  btn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },

  note: {
    marginTop: 20,
    background: "#1f2937",
    padding: 12,
    borderRadius: 10,
    color: "#93c5fd",
  },
};
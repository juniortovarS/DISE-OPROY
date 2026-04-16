import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);

  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);

  const [movimientos, setMovimientos] = useState([]);
  const [limite, setLimite] = useState(1000);

  const [desc, setDesc] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("gasto");

  // 👤 USUARIO
  const name = user?.email?.split("@")[0] || "Usuario";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return;

      setUser(u);
      setUid(u.uid);

      const data =
        JSON.parse(localStorage.getItem(`movimientos_${u.uid}`)) || [];

      const lim =
        Number(localStorage.getItem(`limite_${u.uid}`)) || 1000;

      setMovimientos(data);
      setLimite(lim);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    localStorage.setItem(
      `movimientos_${uid}`,
      JSON.stringify(movimientos)
    );
  }, [movimientos, uid]);

  useEffect(() => {
    if (!uid) return;

    localStorage.setItem(`limite_${uid}`, limite);
  }, [limite, uid]);

  // ➕ ADD MOVIMIENTO
  const addMovimiento = () => {
    if (!desc || !monto || !user) return;

    const now = new Date();

    const nuevo = {
      id: Date.now(),
      desc,
      monto: Number(monto),
      tipo,
      email: user.email,
      uid: user.uid,
      fecha: now.toLocaleDateString("es-PE"),
      hora: now.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      deleted: false,
    };

    setMovimientos((prev) => [...prev, nuevo]);

    setDesc("");
    setMonto("");
    setModal(false);
  };

  const toggleDelete = (id) => {
    setMovimientos((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, deleted: !m.deleted } : m
      )
    );
  };

  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso" && !m.deleted)
    .reduce((a, b) => a + b.monto, 0);

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto" && !m.deleted)
    .reduce((a, b) => a + b.monto, 0);

  const saldo = ingresos - gastos;

  const percent =
    limite > 0 ? Math.round((gastos / limite) * 100) : 0;

  const bgColor =
    ingresos > gastos
      ? "#0b3d2e"
      : gastos > ingresos
      ? "#3b0b0b"
      : "#0f172a";

  return (
    <div style={{ ...styles.page, background: bgColor }}>

      <Sidebar open={menu} setOpen={setMenu} />

      <button onClick={() => setMenu(true)} style={styles.menuBtn}>
        ☰
      </button>

      {/* HEADER */}
      <div style={{ marginBottom: 15 }}>
        <h2 style={{ color: "white", margin: 0 }}>
          👋 Bienvenido {name}
        </h2>

        <p style={{ color: "#ffffffcc", marginTop: 5 }}>
          📅 {new Date().toLocaleDateString("es-PE")} · ⏰{" "}
          {new Date().toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* LIMITE */}
      <div style={styles.card}>
        <p>💳 Límite mensual</p>
        <input
          type="number"
          value={limite}
          onChange={(e) => setLimite(Number(e.target.value))}
          style={styles.input}
        />
      </div>

      {/* GRAFICO */}
      <div style={styles.card}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Gastos", value: gastos },
                { name: "Ingresos", value: ingresos },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
            >
              <Cell fill="#ef4444" />
              <Cell fill="#22c55e" />
            </Pie>

            <text x="50%" y="45%" textAnchor="middle" fontSize={24}>
              S/ {saldo}
            </text>

            <text x="50%" y="55%" textAnchor="middle" fontSize={12}>
              Saldo actual
            </text>
          </PieChart>
        </ResponsiveContainer>

        <p>💸 Gastos: S/ {gastos}</p>
        <p>💰 Ingresos: S/ {ingresos}</p>
        <p>📊 Uso: {percent}%</p>
      </div>

      {/* LISTA */}
      <div style={styles.card}>
        {movimientos.length === 0 && (
          <p>No hay movimientos</p>
        )}

        {movimientos.map((m) => (
          <div key={m.id} style={styles.item}>
            <div>
              {m.tipo === "ingreso" ? "🟢" : "🔴"} {m.desc}
              <br />
              <small>{m.fecha} {m.hora}</small>
            </div>

            <button onClick={() => toggleDelete(m.id)}>
              {m.deleted ? "♻️" : "❌"}
            </button>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => setModal(true)} style={styles.fab}>
        +
      </button>

      {/* MODAL */}
      {modal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Nuevo movimiento</h3>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={styles.input}
            >
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>

            <input
              placeholder="Descripción"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={styles.input}
            />

            <button onClick={addMovimiento}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
    transition: "0.4s",
  },

  header: {
    color: "white",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  list: {
    marginTop: 15,
  },

  item: {
    background: "rgba(0,0,0,0.25)",
    color: "white",
    padding: 10,
    marginTop: 8,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
  },

  btn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },

  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    fontSize: 30,
    border: "none",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: 20,
    borderRadius: 15,
    width: 300,
  },

  saveBtn: {
    width: "100%",
    marginTop: 10,
    background: "#10b981",
    color: "white",
    border: "none",
    padding: 10,
    borderRadius: 8,
  },

  menuBtn: {
    position: "fixed",
    top: 15,
    left: 15,
    width: 45,
    height: 45,
    borderRadius: 12,
    background: "#111",
    color: "white",
    border: "none",
    fontSize: 20,
  },
};
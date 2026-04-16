import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const DAYS_TO_DELETE = 30;

export default function Movimientos() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [movimientos, setMovimientos] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [uid, setUid] = useState(null);

  // 🔐 CARGAR USUARIO + DATOS
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUid(null);
        setMovimientos([]);
        setDeleted([]);
        return;
      }

      const id = user.uid;
      setUid(id);

      const data =
        JSON.parse(localStorage.getItem(`movimientos_${id}`)) || [];

      const trash =
        JSON.parse(localStorage.getItem(`movimientos_trash_${id}`)) || [];

      setMovimientos(data);
      setDeleted(trash);
    });

    return () => unsub();
  }, []);

  // 💾 GUARDAR MOVIMIENTOS (POR USUARIO)
  useEffect(() => {
    if (!uid) return;

    localStorage.setItem(
      `movimientos_${uid}`,
      JSON.stringify(movimientos)
    );
  }, [movimientos, uid]);

  // 💾 GUARDAR PAPELERA (POR USUARIO)
  useEffect(() => {
    if (!uid) return;

    localStorage.setItem(
      `movimientos_trash_${uid}`,
      JSON.stringify(deleted)
    );
  }, [deleted, uid]);

  // 🧠 LIMPIEZA AUTOMÁTICA
  useEffect(() => {
    if (!deleted.length) return;

    const now = Date.now();

    const clean = deleted.filter((m) => {
      if (!m.deletedAt) return true;

      const diffDays =
        (now - Number(m.deletedAt)) / (1000 * 60 * 60 * 24);

      return diffDays < DAYS_TO_DELETE;
    });

    if (clean.length !== deleted.length) {
      setDeleted(clean);
    }
  }, [deleted]);

  // ❌ MOVER A PAPELERA
  const deleteMovimiento = (id) => {
    const item = movimientos.find((m) => m.id === id);
    if (!item) return;

    const trashItem = {
      ...item,
      deletedAt: Date.now(),
    };

    setDeleted([trashItem, ...deleted]);
    setMovimientos(movimientos.filter((m) => m.id !== id));
  };

  // ♻️ RECUPERAR
  const restoreMovimiento = (id) => {
    const item = deleted.find((m) => m.id === id);
    if (!item) return;

    const { deletedAt, ...cleanItem } = item;

    setMovimientos([cleanItem, ...movimientos]);
    setDeleted(deleted.filter((m) => m.id !== id));
  };

  // ❌ BORRAR DEFINITIVO
  const deleteForever = (id) => {
    setDeleted(deleted.filter((m) => m.id !== id));
  };

  // 🔎 FILTRO
  const filtered = movimientos.filter((m) => {
    if (!search) return true;

    const s = search.toLowerCase();

    return (
      m.desc?.toLowerCase().includes(s) ||
      String(m.monto).includes(s) ||
      m.fecha?.includes(s) ||
      m.hora?.includes(s)
    );
  });

  return (
    <div style={styles.page}>

      <button style={styles.menuBtn} onClick={() => setMenu(true)}>
        ☰
      </button>

      <Sidebar open={menu} setOpen={setMenu} />

      <h1>-- 🧾 Mis Movimientos</h1>

      {/* SEARCH */}
      <input
        style={styles.search}
        placeholder="🔎 Buscar movimientos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ACTIVOS */}
      {filtered.map((m) => (
        <div key={m.id} style={styles.card}>
          <div style={styles.row}>
            <span>
              {m.tipo === "ingreso" ? "😊" : "😢"} {m.desc}
            </span>

            <b>S/ {Number(m.monto || 0).toFixed(2)}</b>
          </div>

          <small>
            📅 {m.fecha || "--"} · 🕒 {m.hora || "--"}
          </small>

          <button
            style={styles.deleteBtn}
            onClick={() => deleteMovimiento(m.id)}
          >
            🗑️ Mover a papelera
          </button>
        </div>
      ))}

      {/* PAPELERA */}
      <h3 style={{ marginTop: 30 }}>🗂 Papelera (30 días)</h3>

      {deleted.map((m) => {
        const safeDeletedAt = Number(m.deletedAt || Date.now());

        const daysPassed = Math.floor(
          (Date.now() - safeDeletedAt) / (1000 * 60 * 60 * 24)
        );

        const daysLeft = Math.max(0, DAYS_TO_DELETE - daysPassed);

        return (
          <div key={m.id} style={styles.trash}>
            <div>
              {m.tipo === "ingreso" ? "😊" : "😢"} {m.desc} - S/{" "}
              {Number(m.monto || 0).toFixed(2)}
            </div>

            <small style={{ color: "#facc15" }}>
              ⏳ Se borra en {daysLeft} días
            </small>

            <div style={styles.actions}>
              <button
                style={styles.restoreBtn}
                onClick={() => restoreMovimiento(m.id)}
              >
                ♻️ Recuperar
              </button>

              <button
                style={styles.deleteForever}
                onClick={() => deleteForever(m.id)}
              >
                ❌ Borrar definitivo
              </button>
            </div>
          </div>
        );
      })}
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

  search: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "#111827",
    color: "white",
    marginTop: 10,
  },

  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },

  date: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 5,
  },

  deleteBtn: {
    marginTop: 10,
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px 10px",
    borderRadius: 8,
  },

  trash: {
    background: "#1f2937",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 8,
  },

  restoreBtn: {
    background: "#22c55e",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: 8,
  },

  deleteForever: {
    background: "#7f1d1d",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: 8,
  },
};
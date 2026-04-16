import { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = [];

    for (let key in localStorage) {
      if (key.startsWith("movimientos_")) {
        const uid = key.replace("movimientos_", "");
        const movimientos = JSON.parse(localStorage.getItem(key)) || [];

        const email = localStorage.getItem(`email_${uid}`) || uid;

        const ingresos = movimientos
          .filter((m) => m.tipo === "ingreso")
          .reduce((a, b) => a + Number(b.monto || 0), 0);

        const gastos = movimientos
          .filter((m) => m.tipo === "gasto")
          .reduce((a, b) => a + Number(b.monto || 0), 0);

        data.push({
          uid,
          email,
          ingresos,
          gastos,
          saldo: ingresos - gastos,
          totalMovimientos: movimientos.length,
        });
      }
    }

    setUsers(data);
  }, []);

  const totalIngresos = users.reduce((a, b) => a + b.ingresos, 0);
  const totalGastos = users.reduce((a, b) => a + b.gastos, 0);

  return (
    <div style={styles.page}>
      <h1>🛠 Panel Admin Pro</h1>

      {/* GLOBAL */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>💰 Ingresos globales</h3>
          <h2>S/ {totalIngresos.toFixed(2)}</h2>
        </div>

        <div style={styles.card}>
          <h3>💸 Gastos globales</h3>
          <h2>S/ {totalGastos.toFixed(2)}</h2>
        </div>
      </div>

      {/* USERS */}
      <h2 style={{ marginTop: 20 }}>👥 Usuarios</h2>

      {users.map((u, i) => (
        <div key={i} style={styles.userCard}>
          <h3>📧 {u.email}</h3>

          <p>💰 Ingresos: S/ {u.ingresos.toFixed(2)}</p>
          <p>💸 Gastos: S/ {u.gastos.toFixed(2)}</p>
          <p>📊 Saldo: S/ {u.saldo.toFixed(2)}</p>
          <p>📌 Movimientos: {u.totalMovimientos}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f19",
    color: "white",
    padding: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
  },

  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
  },

  userCard: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
};
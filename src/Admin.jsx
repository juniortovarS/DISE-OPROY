import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "movimientos"));

        const movimientos = snap.docs.map((doc) => doc.data());

        // 🔥 AGRUPAR POR EMAIL
        const grouped = {};

        movimientos.forEach((m) => {
          const email = m.email || "Sin correo";

          if (!grouped[email]) {
            grouped[email] = {
              email,
              ingresos: 0,
              gastos: 0,
              total: 0,
              count: 0,
            };
          }

          if (m.tipo === "ingreso") {
            grouped[email].ingresos += m.monto;
          } else {
            grouped[email].gastos += m.monto;
          }

          grouped[email].count += 1;
        });

        // calcular saldo
        const result = Object.values(grouped).map((u) => ({
          ...u,
          total: u.ingresos - u.gastos,
        }));

        setData(result);
      } catch (error) {
        console.log("Error admin:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.page}>
      <h1>🛠 Panel Admin Pro</h1>

      <h3>👥 Usuarios (por correo)</h3>

      {data.map((u) => (
        <div key={u.email} style={styles.card}>
          <p>📧 {u.email}</p>

          <p>💰 Ingresos: S/ {u.ingresos.toFixed(2)}</p>
          <p>💸 Gastos: S/ {u.gastos.toFixed(2)}</p>
          <p>📊 Saldo: S/ {u.total.toFixed(2)}</p>
          <p>📌 Movimientos: {u.count}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#0b0f19",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  card: {
    background: "#111827",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
};
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>

            <h3>📊 Menú</h3>

            <div style={styles.item} onClick={() => go("/dashboard")}>
              🏠 Inicio
            </div>

            <div style={styles.item} onClick={() => go("/movimientos")}>
              🧾 Mis movimientos
            </div>

            <div style={styles.item} onClick={() => go("/reporte")}>
              📄 Reporte de movimientos
            </div>

            <div style={styles.item} onClick={() => go("/soporte")}>
              🆘 Soporte técnico
            </div>

          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 999,
  },

  sidebar: {
    width: 270,
    height: "100%",
    background: "#0f172a",
    color: "white",
    padding: 20,
    animation: "slideIn 0.25s ease-out",
    boxShadow: "10px 0 30px rgba(0,0,0,0.3)",
  },

  item: {
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    cursor: "pointer",
    transition: "0.2s",
    background: "#111827",
  },
};
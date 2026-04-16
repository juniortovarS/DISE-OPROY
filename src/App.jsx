import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Movimientos from "./pages/Movimientos";
import Reporte from "./pages/Reporte";
import Soporte from "./pages/Soporte";
import Admin from "./pages/Admin"; // 👈 IMPORTANTE
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* app */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/soporte" element={<Soporte />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}
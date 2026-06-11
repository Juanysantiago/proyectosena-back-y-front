import './App.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TipoDocumentosCrud from "./pages/TipoDocumentosCrud";
import VehiculosCrud from './pages/VehiculosCrud';
import ConfigGrCrud from './pages/ConfigGrCrud';
import EntradaSalidaCrud from './pages/EntradaSalidaCrud';

import DashboardGuarda from "./pages/DashboardGuarda";
import DashboardAprendiz from "./pages/DashboardAprendiz";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>

      {user && <Navbar />}

      <Routes>
        {/* Login como pantalla principal */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/dashboard-admin" element={<Home />} />

        {/* Guarda */}
        <Route
          path="/dashboard-guarda"
          element={<DashboardGuarda />}
        />

        {/* Aprendiz */}
        <Route
          path="/dashboard-aprendiz"
          element={<DashboardAprendiz />}
        />

        <Route path="/tipo-documentos" element={<TipoDocumentosCrud />} />
        <Route path="/vehiculos" element={<VehiculosCrud />} />
        <Route path="/config-gr" element={<ConfigGrCrud />} />
        <Route path="/entrada-salida" element={<EntradaSalidaCrud />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </BrowserRouter>
  );
}
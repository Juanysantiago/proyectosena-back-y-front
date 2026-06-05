// Importa useState (aunque no se usa aquí, podría servir después)
import { useState } from 'react'
import './App.css'

// Importa las páginas (cada una es un componente)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TipoDocumentosCrud from "./pages/TipoDocumentosCrud";
import VehiculosCrud from './pages/VehiculosCrud';
import ConfigGrCrud from './pages/ConfigGrCrud';
import EntradaSalidaCrud from './pages/EntradaSalidaCrud';

// Importa herramientas de React Router para navegación
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Componente principal de la aplicación
export default function App() {
  return (
    // BrowserRouter: Habilita el enrutamiento en la app
    <BrowserRouter>
      {/* Navbar: Barra de navegación que se muestra en todas las páginas */}
      <Navbar />

      {/* Routes: Contiene todas las rutas de la aplicación */}
      <Routes>
        {/* Cada Route asocia una URL con un componente */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tipo-documentos" element={<TipoDocumentosCrud />} />
        <Route path="/vehiculos" element={<VehiculosCrud />} />
        <Route path="/config-gr" element={<ConfigGrCrud />} />
        <Route path="/entrada-salida" element={<EntradaSalidaCrud />} />

        {/* Fallback: Si la URL no existe, redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
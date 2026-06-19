import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import OlvideContraseña from "./pages/OlvideContraseña";
import VerificarCodigo from "./pages/VerificarCodigo";
import Register from "./pages/Register";

import TipoDocumentosCrud from "./pages/administrador/TipoDocumentosCrud";
import VehiculosCrud from "./pages/administrador/VehiculosCrud";
import ConfigGrCrud from "./pages/administrador/ConfigGrCrud";
import EntradaSalidaCrud from "./pages/administrador/EntradaSalidaCrud";

import DashboardGuarda from "./pages/guarda/DashboardGuarda";

// Módulo Guarda
import InicioGuarda from "./pages/guarda/InicioGuarda";
import EscanearQR from "./pages/guarda/EscanearQR";
import ManualPlataforma from "./pages/guarda/ManualPlataforma";
import IngresoSalida from "./pages/guarda/IngresoSalida";

// Módulo Aprendiz
import DashboardAprendiz from "./pages/aprendiz/DashboardAprendiz";
import InicioAprendiz from "./pages/aprendiz/InicioAprendiz";
import VisualizarCarnet from "./pages/aprendiz/VisualizarCarnet";
import ActualizarDatos from "./pages/aprendiz/ActualizarDatos";
import PeticionCarnet from "./pages/aprendiz/PeticionCarnet";
import ManualUso from "./pages/aprendiz/ManualUso";
import SoporteTecnico from "./pages/aprendiz/SoporteTecnico";
import VencimientoCarnet from "./pages/aprendiz/VencimientoCarnet";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

   <Route
  path="/olvide-contraseña"
  element={<OlvideContraseña />}
/>

<Route
  path="/verificar-codigo"
  element={<VerificarCodigo />}
/>

        {/* Dashboard Admin */}
        <Route
          path="/dashboard-admin"
          element={<Home />}
        />

        {/* Dashboard Guarda */}
        <Route
          path="/dashboard-guarda"
          element={<DashboardGuarda />}
        >
          <Route
            index
            element={<InicioGuarda />}
          />

          <Route
            path="escanear-qr"
            element={<EscanearQR />}
          />

          <Route
            path="manual"
            element={<ManualPlataforma />}
          />

          <Route
            path="ingreso-salida"
            element={<IngresoSalida />}
          />
        </Route>

        {/* Dashboard Aprendiz */}
        <Route
          path="/dashboard-aprendiz"
          element={<DashboardAprendiz />}
        >
          <Route
            index
            element={<InicioAprendiz />}
          />

          <Route
            path="visualizar-carnet"
            element={<VisualizarCarnet />}
          />

          <Route
            path="actualizar-datos"
            element={<ActualizarDatos />}
          />

          <Route
            path="peticion-carnet"
            element={<PeticionCarnet />}
          />

          <Route
            path="manual"
            element={<ManualUso />}
          />

          <Route
            path="soporte"
            element={<SoporteTecnico />}
          />

          <Route
            path="vencimiento"
            element={<VencimientoCarnet />}
          />
        </Route>

        {/* CRUD */}
        <Route
          path="/tipo-documentos"
          element={<TipoDocumentosCrud />}
        />

        <Route
          path="/vehiculos"
          element={<VehiculosCrud />}
        />

        <Route
          path="/config-gr"
          element={<ConfigGrCrud />}
        />

        <Route
          path="/entrada-salida"
          element={<EntradaSalidaCrud />}
        />

        {/* Ruta no encontrada */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
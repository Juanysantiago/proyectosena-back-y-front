import "./App.css";

import Login from "./pages/Login";
import OlvideContraseña from "./pages/OlvideContraseña";
import VerificarCodigo from "./pages/VerificarCodigo";
import Register from "./pages/Register";

// ================= ADMINISTRADOR =================
import DashboardAdmin from "./pages/administrador/DashboardAdmin";
import InicioAdmin from "./pages/administrador/InicioAdmin";
import VerPeticiones from "./pages/administrador/VerPeticiones";
import Bloqueos from "./pages/administrador/Bloqueos";
import DatosUsuarios from "./pages/administrador/DatosUsuarios";
import ReportesRecibidos from "./pages/administrador/ReportesRecibidos";
import TipoDocumentosCrud from "./pages/administrador/TipoDocumentosCrud";
import VehiculosCrud from "./pages/administrador/VehiculosCrud";
import ConfigGrCrud from "./pages/administrador/CentroFormacionCrud";
import SolicitudesActualizacionAdmin from "./pages/administrador/SolicitudesActualizacionAdmin";
import SoporteAdmin from "./pages/administrador/SoporteAdmin";

// ================= GUARDA =================
import DashboardGuarda from "./pages/guarda/DashboardGuarda";
import InicioGuarda from "./pages/guarda/InicioGuarda";
import EscanearQR from "./pages/guarda/EscanearQR";
import ManualPlataforma from "./pages/guarda/ManualPlataforma";
import IngresoSalida from "./pages/guarda/IngresoSalida";
import EntradaSalidaCrud from "./pages/guarda/EntradaSalidaCrud";

// ================= APRENDIZ =================
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

        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/olvide-contraseña"
          element={<OlvideContraseña />}
        />

        <Route
          path="/verificar-codigo"
          element={<VerificarCodigo />}
        />

        {/* ================= ADMINISTRADOR ================= */}

        <Route
          path="/dashboard-admin"
          element={<DashboardAdmin />}
        >
          <Route
            index
            element={<InicioAdmin />}
          />

          <Route
            path="ver-peticiones"
            element={<VerPeticiones />}
          />

          <Route
            path="bloqueos"
            element={<Bloqueos />}
          />

          <Route
            path="datos-usuarios"
            element={<DatosUsuarios />}
          />

          <Route
            path="reportes"
            element={<ReportesRecibidos />}
          />

          <Route
            path="tipo-documentos"
            element={<TipoDocumentosCrud />}
          />

          <Route
            path="vehiculos"
            element={<VehiculosCrud />}
          />

          <Route
            path="centros-formacion"
            element={<ConfigGrCrud />}
          />

          <Route
            path="entrada-salida"
            element={<EntradaSalidaCrud />}
          />

          <Route
            path="solicitudes-actualizacion"
            element={<SolicitudesActualizacionAdmin />}
          />

          <Route
            path="soporte"
            element={<SoporteAdmin />}
          />
        </Route>

        {/* ================= GUARDA ================= */}

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

          <Route
            path="entrada-salida"
            element={<EntradaSalidaCrud />}
          />
        </Route>

        {/* ================= APRENDIZ ================= */}

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

        {/* ================= RUTA NO ENCONTRADA ================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
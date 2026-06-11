import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 15px",
  borderRadius: "6px",
  textDecoration: "none",
  color: isActive ? "#fff" : "#333",
  backgroundColor: isActive ? "#16bb00" : "transparent",
  fontWeight: "500",
});

// Estilo para los nuevos botones de admin (puedes personalizarlo)
const adminLinkStyle = ({ isActive }) => ({
  padding: "10px 15px",
  borderRadius: "6px",
  textDecoration: "none",
  color: isActive ? "#fff" : "#555",
  backgroundColor: isActive ? "#2c3e50" : "#f0f0f0",
  fontWeight: "500",
  border: "1px solid #ddd",
});

export default function AdminDashboard() {
  return (
    <div>
      <h1>ADMIN</h1>

      {/* ========== TUS 4 BOTONES ORIGINALES ========== */}
      <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <NavLink to="vehiculos" style={linkStyle}>
          Vehículos
        </NavLink>

        <NavLink to="documentos" style={linkStyle}>
          Tipo Documentos
        </NavLink>

        <NavLink to="configgr" style={linkStyle}>
          Configuración GR
        </NavLink>

        <NavLink to="entrada-salida" style={linkStyle}>
          Entrada/Salida
        </NavLink>
      </nav>

      {/* ========== NUEVOS BOTONES DE ADMIN (AGREGADOS SIN ELIMINAR LOS DE ARRIBA) ========== */}
      <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <NavLink to="inicio" style={adminLinkStyle}>
          INICIO
        </NavLink>

        <NavLink to="ver-peticiones" style={adminLinkStyle}>
          VER PETICIONES
        </NavLink>

        <NavLink to="generar-carnet" style={adminLinkStyle}>
          GENERAR CARNET
        </NavLink>

        <NavLink to="bloqueos-reportes" style={adminLinkStyle}>
          BLOQUEOS / REPORTE DE APRENDICES
        </NavLink>

        <NavLink to="reportes-recibidos" style={adminLinkStyle}>
          Reportes recibidos
        </NavLink>

        <NavLink to="datos-usuarios" style={adminLinkStyle}>
          Datos de usuarios
        </NavLink>

        <NavLink to="/login" style={{ ...adminLinkStyle({ isActive: false }), backgroundColor: "#c0392b", color: "#fff", border: "none" }}>
          Cerrar sesión
        </NavLink>
      </nav>

      {/* 👇 AQUÍ SE MUESTRA LO QUE SELECCIONAS */}
      <div style={{ marginTop: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
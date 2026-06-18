import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 15px",
  borderRadius: "6px",
  textDecoration: "none",
  color: isActive ? "#fff" : "#333",
  backgroundColor: isActive ? "#16bb00" : "transparent",
  fontWeight: "500",
});

export default function NavbarAdmin() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav
      style={{
        background: "#fff",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <h2 style={{ color: "#16bb00" }}>SenaParking</h2>

        <NavLink to="/dashboard-admin" style={linkStyle}>
          Inicio
        </NavLink>

        <NavLink to="/tipo-documentos" style={linkStyle}>
          Tipo Documentos
        </NavLink>

        <NavLink to="/vehiculos" style={linkStyle}>
          Vehículos
        </NavLink>

        <NavLink to="/config-gr" style={linkStyle}>
          Configuración GR
        </NavLink>

        <NavLink to="/entrada-salida" style={linkStyle}>
          Entrada/Salida
        </NavLink>
      </div>

      <button onClick={logout}>Cerrar sesión</button>
    </nav>
  );
}
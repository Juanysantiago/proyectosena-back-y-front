// Importa NavLink para enlaces con estilo activo
import { NavLink } from "react-router-dom";

// Estilo para los enlaces (cambia si es la página actual)
const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "white" : "#000000",      // Blanco si está activo
  background: isActive ? "#16bb00" : "transparent", // Fondo negro si está activo
});

// Componente de barra de navegación
export default function Navbar() {
  // Revisa si hay token guardado (usuario autenticado)
  const token = localStorage.getItem("accessToken");

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("accessToken");  // Borra el token
    localStorage.removeItem("user");         // Borra los datos del usuario
    window.location.href = "/";              // Redirige al inicio
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid #e4e4e4",
        fontFamily: "sans-serif",
      }}
    >
      {/* Parte izquierda: Logo y enlaces principales */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16bb00" }}>
        <strong>SenaParking</strong>  {/* Logo del sitio */}

        <NavLink to="/" style={linkStyle}>Inicio</NavLink>
        <NavLink to="/login" style={linkStyle}>Login</NavLink>
        <NavLink to="/register" style={linkStyle}>Registro</NavLink>
        <NavLink to="/tipo-documentos" style={linkStyle}>Tipo Documentos</NavLink>
        <NavLink to="/vehiculos" style={linkStyle}>Vehículos</NavLink>
        <NavLink to="/config-gr" style={linkStyle}>Configuración GR</NavLink>
        <NavLink to="/entrada-salida" style={linkStyle}>Entrada/Salida</NavLink>
      </div>

    

      {/* Parte derecha: Estado de autenticación y botón de salir */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#444" }}>
          {token ? "Autenticado" : "No autenticado"}
        </span>
        {token ? (  // Solo muestra "Salir" si hay usuario autenticado
          <button onClick={logout} style={{ padding: "8px 12px" }}>
            Salir
          </button>
        ) : null}
      </div>
    </nav>
  );
}
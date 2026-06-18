import { Link } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import "../styles/home.css";

export default function Home() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

 return (
  <>
    <NavbarAdmin />

    <div className="home-container">
      <div className="home-card">

        <h1>🚗 Sistema de Control de Acceso</h1>

        <p className="subtitle">
          Bienvenido. Usa el menú superior para navegar por el sistema.
        </p>

        {user ? (
          <div className="user-box">
            <h3>👤 Sesión activa</h3>

            <p><strong>Correo:</strong> {user.email}</p>

            <p><strong>ID:</strong> {user.id}</p>

          </div>
        ) : (
          <div className="warning-box">

            <p>⚠️ No has iniciado sesión.</p>

            <div className="auth-buttons">

              <Link to="/" className="btn-primary">
                Iniciar Sesión
              </Link>

              <Link to="/register" className="btn-secondary">
                Registrarse
              </Link>

            </div>

          </div>
        )}

        <h2>Accesos Rápidos</h2>

        <div className="cards-grid">

          <Link to="/tipo-documentos" className="menu-card">
            📄
            <span>Documentos</span>
          </Link>

          <Link to="/vehiculos" className="menu-card">
            🚘
            <span>Vehículos</span>
          </Link>

          <Link to="/config-gr" className="menu-card">
            ⚙️
            <span>Configuración</span>
          </Link>

          <Link to="/entrada-salida" className="menu-card">
            🚦
            <span>Entrada / Salida</span>
          </Link>

        </div>

      </div>
    </div>
  </>
);
}
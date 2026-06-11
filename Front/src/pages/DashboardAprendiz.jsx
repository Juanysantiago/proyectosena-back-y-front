import { useState } from "react";
import "../styles/dashboardAprendiz.css";


export default function DashboardAprendiz() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="aprendiz-container">

      <header className="aprendiz-header">
        <div className="logo">
          <h2>SENA PARKING</h2>
        </div>

        <nav className="top-menu">
          <button className="active">INICIO</button>
          <button>VISUALIZAR CARNET</button>
          <button>ACTUALIZAR DATOS</button>
          <button>PETICIÓN DEL CARNET</button>
        </nav>

        <div className="menu-container">
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {menuOpen && (
            <div className="dropdown">
              <button>Manual de uso</button>
              <button>Soporte técnico</button>
              <button>Vencimiento carnet</button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="contenido">
        <div className="panel-central">
          <h2>Bienvenido {user?.nombres}</h2>

          <p>
            Sistema de gestión de parqueadero SENA.
          </p>

          <a href="/vehiculos" className="btn-vehiculos">
            Mis Vehículos
          </a>
        </div>
      </main>

    </div>
  );
}
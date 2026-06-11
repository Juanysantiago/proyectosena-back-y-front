import { useState } from "react";
import "../styles/DashboardGuarda.css";

export default function DashboardGuarda() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="guarda-container">

      <header className="guarda-header">

        <div className="logo-box">
          <img src="/logo.png" alt="Sena Parking" />
        </div>

        <button className="menu-item active">
          INICIO
        </button>

        <button className="menu-item">
          ESCANEAR QR
        </button>

        <button className="menu-item">
          MANUAL DE MANEJO DE LA PLATAFORMA
        </button>

        <button className="menu-item">
          VISUALIZAR INGRESO Y SALIDA
        </button>

        <div className="menu-hamburger">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {menuOpen && (
            <div className="dropdown">
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

      <main className="guarda-content">
        <div className="content-box">
          {/* Aquí irá la información */}
        </div>
      </main>

    </div>
  );
}
import { useState } from "react";
import "../styles/DashboardGuarda.css";

export default function DashboardGuarda() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="guarda-container">

      <header className="guarda-header">


        <div className="menu-hamburger">
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
import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../styles/logo/logo sena parking.png";
import "../styles/guarda/NavbarGuarda.css";

export default function NavbarGuarda() {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="guarda-header">

      <div className="logo">
        <img src={logo} alt="Logo Sena Parking" />
      </div>

      <nav className="menu-principal">

        <NavLink to="/dashboard-guarda">
          INICIO
        </NavLink>

        <NavLink to="/dashboard-guarda/escanear-qr">
          ESCANEAR QR
        </NavLink>

        <NavLink to="/dashboard-guarda/manual">
          MANUAL
        </NavLink>

      

        <NavLink to="/dashboard-guarda/entrada-salida">
          ENTRADA / SALIDA
        </NavLink>

      </nav>

      <div className="menu-hamburguesa">

        <button
          className="hamburguesa"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="dropdown">

            <button onClick={logout}>
              Cerrar sesión
            </button>

          </div>
        )}

      </div>

    </header>
  );
}
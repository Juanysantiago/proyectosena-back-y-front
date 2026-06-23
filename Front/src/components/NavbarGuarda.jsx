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

        <NavLink to="/dashboard-guarda/ingreso-salida">
          INGRESO Y SALIDA
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

            <NavLink
              to="/dashboard-guarda"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </NavLink>

            <NavLink
              to="/dashboard-guarda/escanear-qr"
              onClick={() => setMenuOpen(false)}
            >
              Escanear QR
            </NavLink>

            <NavLink
              to="/dashboard-guarda/manual"
              onClick={() => setMenuOpen(false)}
            >
              Manual
            </NavLink>

            <NavLink
              to="/dashboard-guarda/ingreso-salida"
              onClick={() => setMenuOpen(false)}
            >
              Ingreso y Salida
            </NavLink>

            <NavLink
              to="/dashboard-guarda/entrada-salida"
              onClick={() => setMenuOpen(false)}
            >
              Entrada / Salida
            </NavLink>

            <button onClick={logout}>
              Cerrar sesión
            </button>

          </div>
        )}

      </div>

    </header>
  );
}
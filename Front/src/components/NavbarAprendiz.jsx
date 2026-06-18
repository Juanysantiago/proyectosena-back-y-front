import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/aprendiz/navbarAprendiz.css";
import logo from "../styles/logo/logo sena parking.png";

export default function NavbarAprendiz() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const cerrarMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="aprendiz-header">

   <div className="logo">
  <img src={logo} alt="Sena Parking" />
</div>

      <nav className="menu-principal">

        <NavLink
          to="/dashboard-aprendiz"
          end
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          INICIO
        </NavLink>

        <NavLink
          to="/dashboard-aprendiz/visualizar-carnet"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          VISUALIZAR CARNET
        </NavLink>

        <NavLink
          to="/dashboard-aprendiz/actualizar-datos"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          ACTUALIZAR DATOS
        </NavLink>

        <NavLink
          to="/dashboard-aprendiz/peticion-carnet"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          PETICIÓN DEL CARNET
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
              to="/dashboard-aprendiz/manual"
              onClick={cerrarMenu}
            >
              Manual de uso
            </NavLink>

            <NavLink
              to="/dashboard-aprendiz/soporte"
              onClick={cerrarMenu}
            >
              Soporte técnico
            </NavLink>

            <NavLink
              to="/dashboard-aprendiz/vencimiento"
              onClick={cerrarMenu}
            >
              Vencimiento carnet
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
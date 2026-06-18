import { NavLink } from "react-router-dom";

export default function NavbarGuarda() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav
      style={{
        background: "#16bb00",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>

        <NavLink
          to="/dashboard-guarda"
          style={{ color: "white", marginRight: 20 }}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/entrada-salida"
          style={{ color: "white" }}
        >
          Entrada / Salida
        </NavLink>

      </div>

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </nav>
  );
}
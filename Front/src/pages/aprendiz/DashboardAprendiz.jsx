import { Outlet } from "react-router-dom";
import "../../styles/aprendiz/dashboardAprendiz.css";
import NavbarAprendiz from "../../components/NavbarAprendiz";

export default function DashboardAprendiz() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="aprendiz-page">

      <NavbarAprendiz />

      <div className="fondo">

        <div className="panel-central">

          <div className="bienvenida">
            <h2>Bienvenido</h2>
            <h3>{user?.nombres} {user?.apellidos}</h3>
          </div>

          <Outlet />

        </div>

      </div>

    </div>
  );
}
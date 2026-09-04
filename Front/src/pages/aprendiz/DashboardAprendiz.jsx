import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/aprendiz/dashboardAprendiz.css";
import NavbarAprendiz from "../../components/NavbarAprendiz";
import { axiosClient } from "../../api/axiosClient";

export default function DashboardAprendiz() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {

      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      if (!usuarioLocal?.id) {
        console.log("No se encontró el usuario en localStorage");
        return;
      }

      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      const usuario = res.data;

      // Actualizamos el estado con los datos frescos
      setUser(usuario);

      // También actualizamos localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(usuario)
      );

    } catch (error) {

      console.log(
        "Error al cargar los datos del usuario:",
        error
      );

      // Si falla el backend, usamos los datos guardados
      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      setUser(usuarioLocal);
    }
  };

  return (
    <div className="aprendiz-page">

      <NavbarAprendiz />

      <div className="fondo">

        <div className="panel-central">

          <div className="bienvenida">

            <h2>Bienvenido</h2>

            <h3>
              {user?.nombres} {user?.apellidos}
            </h3>

          </div>

          <Outlet />

        </div>

      </div>

    </div>
  );
}


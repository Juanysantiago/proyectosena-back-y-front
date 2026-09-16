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

    // Primero usamos el usuario guardado
    const usuarioGuardado =
      localStorage.getItem("user");

    if (!usuarioGuardado) {
      return;
    }

    let usuarioLocal;

    try {
      usuarioLocal =
        JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error(
        "Error leyendo usuario:",
        error
      );

      return;
    }

    // Mostrar inmediatamente los datos
    setUser(usuarioLocal);

    // Intentar actualizar los datos desde el backend
    if (!usuarioLocal?.id) {
      return;
    }

    try {

      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      const usuarioActualizado =
        res.data;

      setUser(usuarioActualizado);

      localStorage.setItem(
        "user",
        JSON.stringify(usuarioActualizado)
      );

    } catch (error) {

      console.log(
        "No se pudieron actualizar los datos. Se usarán los datos locales."
      );

      // No redirigir.
      // Conservamos el usuario guardado.
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
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/administrador/bloqueos.css";

export default function Bloqueos() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, [busqueda]);

  const cargarUsuarios = async () => {
    try {
      const res = await axiosClient.get(
        `/auth/users?nombre=${busqueda}`
      );
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const accion = async (userId, tipo) => {
    let motivo = "";

    if (tipo === "reporte") {
      motivo = prompt("Escriba la causa del reporte");
      if (!motivo) return;
    }

    try {
      await axiosClient.post("/api/usuarios/accion", {
        userId,
        tipo,
        motivo
      });

      cargarUsuarios();
    } catch (error) {
      alert(error.response?.data?.message || "Error en la acción");
    }
  };

  return (
    <div className="content-box">
      <h2>Bloqueos / Reportes</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Buscar usuario por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="user-list">
        {usuarios.map((u) => (
          <div key={u.id} className="user-card">

            <div className="user-name">
              {u.nombres} {u.apellidos}
            </div>

            <div className="user-role">
              Rol: {u.rol}
            </div>

            <span
              className={`badge ${
                u.estado === "bloqueado" ? "blocked" : "active"
              }`}
            >
              {u.estado === "bloqueado" ? "Bloqueado" : "Activo"}
            </span>

            <div className="actions">
              <button
                className="btn btn-report"
                onClick={() => accion(u.id, "reporte")}
              >
                Reportar
              </button>

              <button
                className="btn btn-block"
                onClick={() => accion(u.id, "bloqueo")}
              >
                Bloquear
              </button>

              <button
                className="btn btn-unblock"
                onClick={() => accion(u.id, "desbloqueo")}
              >
                Desbloquear
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
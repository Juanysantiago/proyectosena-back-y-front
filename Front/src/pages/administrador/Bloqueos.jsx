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
        motivo,
      });

      cargarUsuarios();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error en la acción"
      );
    }
  };

  return (
    <div className="bloqueos-container">

      {/* TÍTULO */}

      <div className="bloqueos-header">
        <h1>Bloqueos / Reportes</h1>

        <p>
          Administra los bloqueos y reportes de los usuarios
          del sistema.
        </p>
      </div>

      {/* CONTENIDO */}

      <div className="bloqueos-card">

        {/* BUSCADOR */}

        <div className="search-container">

          <input
            className="search-input"
            type="text"
            placeholder="Buscar usuario por nombre..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />

        </div>

        {/* LISTA */}

        <div className="user-list">

          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <div
                key={u.id}
                className="user-card"
              >

                <div className="user-info">

                  <div className="user-name">
                    {u.nombres} {u.apellidos}
                  </div>

                  <div className="user-role">
                    Rol: {u.rol}
                  </div>

                </div>

                <span
                  className={`badge ${
                    u.estado === "bloqueado"
                      ? "blocked"
                      : "active"
                  }`}
                >
                  {u.estado === "bloqueado"
                    ? "Bloqueado"
                    : "Activo"}
                </span>

                <div className="actions">

                  <button
                    className="btn btn-report"
                    onClick={() =>
                      accion(u.id, "reporte")
                    }
                  >
                    Reportar
                  </button>

                  <button
                    className="btn btn-block"
                    onClick={() =>
                      accion(u.id, "bloqueo")
                    }
                  >
                    Bloquear
                  </button>

                  <button
                    className="btn btn-unblock"
                    onClick={() =>
                      accion(u.id, "desbloqueo")
                    }
                  >
                    Desbloquear
                  </button>

                </div>

              </div>
            ))
          ) : (
            <div className="empty-users">
              No se encontraron usuarios.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
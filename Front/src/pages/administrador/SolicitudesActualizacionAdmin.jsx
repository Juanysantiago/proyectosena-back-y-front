import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";

export default function SolicitudesActualizacionAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await axiosClient.get(
        "/api/solicitudes-actualizacion"
      );

      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const aprobar = async (id) => {
    try {
      await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/aprobar`
      );

      alert("Solicitud aprobada");

      cargarSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  const rechazar = async (id) => {
    try {
      await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/rechazar`
      );

      alert("Solicitud rechazada");

      cargarSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="crud-container">
      <h2>Solicitudes de Actualización</h2>

      {solicitudes.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >
          <h3>
            {s.user?.nombres} {s.user?.apellidos}
          </h3>

          <p>
            Documento:
            {" "}
            {s.user?.documento}
          </p>

          <p>
            Ficha:
            {" "}
            {s.user?.ficha}
          </p>

          <p>
            Tipo:
            {" "}
            {s.tipo}
          </p>

          <p>
            Estado:
            {" "}
            {s.estado}
          </p>

          <h4>Datos actuales</h4>

          <pre>
            {JSON.stringify(
              s.datosActuales,
              null,
              2
            )}
          </pre>

          <h4>Datos nuevos</h4>

          <pre>
            {JSON.stringify(
              s.datosNuevos,
              null,
              2
            )}
          </pre>

          {s.fotoNueva && (
            <>
              <h4>Nueva Foto</h4>

              <img
                src={`http://localhost:3000/${s.fotoNueva}`}
                alt="vehiculo"
                width="250"
              />
            </>
          )}

          {s.estado === "pendiente" && (
            <>
              <button
                onClick={() =>
                  aprobar(s.id)
                }
              >
                Aprobar
              </button>

              <button
                onClick={() =>
                  rechazar(s.id)
                }
              >
                Rechazar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
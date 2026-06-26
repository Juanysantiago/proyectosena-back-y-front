import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/administrador/solicitudesActualizacion.css";

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
    await axiosClient.put(
      `/api/solicitudes-actualizacion/${id}/aprobar`
    );

    cargarSolicitudes();
  };

  const rechazar = async (id) => {
    await axiosClient.put(
      `/api/solicitudes-actualizacion/${id}/rechazar`
    );

    cargarSolicitudes();
  };

  return (
    <div className="crud-container">
      <h2>Solicitudes de Actualización</h2>

      {solicitudes.map((s) => {

        let datosActuales = {};
        let datosNuevos = {};
        let documentos = [];

        // DATOS ACTUALES
        try {
          datosActuales =
            typeof s.datosActuales === "string"
              ? JSON.parse(s.datosActuales)
              : s.datosActuales || {};
        } catch {
          datosActuales = {};
        }

        // DATOS NUEVOS
        try {
          datosNuevos =
            typeof s.datosNuevos === "string"
              ? JSON.parse(s.datosNuevos)
              : s.datosNuevos || {};
        } catch {
          datosNuevos = {};
        }

        // DOCUMENTOS
        try {
          documentos =
            typeof s.documentos === "string"
              ? JSON.parse(s.documentos)
              : Array.isArray(s.documentos)
              ? s.documentos
              : [];
        } catch {
          documentos = [];
        }

        return (
          <div
            key={s.id}
            className="solicitud-card"
          >
            <div className="cabecera">
              <h3>
                {s.user?.nombres} {s.user?.apellidos}
              </h3>

              <span className={`estado ${s.estado}`}>
                {s.estado}
              </span>
            </div>

            <div className="info-general">
              <p>
                <strong>Documento:</strong>{" "}
                {s.user?.documento}
              </p>

              <p>
                <strong>Ficha:</strong>{" "}
                {s.user?.ficha}
              </p>

              <p>
                <strong>Tipo:</strong>{" "}
                {s.tipo}
              </p>
            </div>

            <div className="comparacion">

              <div>
                <h4>Datos actuales</h4>

                {Object.entries(datosActuales).map(
                  ([k, v]) => (
                    <div
                      key={k}
                      className="dato"
                    >
                      <strong>{k}</strong>

                      <span>
                        {String(v || "-")}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div>
                <h4>Datos nuevos</h4>

                {Object.entries(datosNuevos).map(
                  ([k, v]) => (
                    <div
                      key={k}
                      className="dato"
                    >
                      <strong>{k}</strong>

                      <span>
                        {String(v || "-")}
                      </span>
                    </div>
                  )
                )}
              </div>

            </div>

            {s.fotoNueva && (
              <div className="foto">
                <h4>Nueva Foto</h4>

                <img
                  src={`http://localhost:3000/${s.fotoNueva}`}
                  alt=""
                />
              </div>
            )}

            {documentos.length > 0 && (
              <>
                <h4>Documentos anexos</h4>

                {documentos.map((d, i) => (
                  <div
                    key={i}
                    className="documento"
                  >
                    <span>{d.nombre}</span>

                    <a
                      href={`http://localhost:3000/${d.ruta}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver
                    </a>
                  </div>
                ))}
              </>
            )}

            {s.estado === "pendiente" && (
              <div className="acciones">
                <button
                  className="aprobar"
                  onClick={() => aprobar(s.id)}
                >
                  Aprobar
                </button>

                <button
                  className="rechazar"
                  onClick={() => rechazar(s.id)}
                >
                  Rechazar
                </button>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
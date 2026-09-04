
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/administrador/solicitudesActualizacion.css";

export default function SolicitudesActualizacionAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [procesando, setProcesando] = useState(null);

  /* =========================================================
     CARGAR SOLICITUDES
  ========================================================= */

  useEffect(() => {
    console.log(
      "🟣 SolicitudesActualizacionAdmin CARGADO"
    );

    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      console.log(
        "🔵 Cargando solicitudes de actualización..."
      );

      const res = await axiosClient.get(
        "/api/solicitudes-actualizacion"
      );

      console.log(
        "✅ Solicitudes recibidas:",
        res.data
      );

      setSolicitudes(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "❌ ERROR CARGANDO SOLICITUDES:",
        error
      );

      console.error(
        "❌ STATUS:",
        error.response?.status
      );

      console.error(
        "❌ RESPUESTA:",
        error.response?.data
      );
    }
  };

  /* =========================================================
     APROBAR
  ========================================================= */

  const aprobar = async (id) => {
    console.log(
      "===================================="
    );

    console.log(
      "🟢 CLICK EN APROBAR"
    );

    console.log(
      "🟢 ID DE SOLICITUD:",
      id
    );

    console.log(
      "===================================="
    );

    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      console.error(
        "❌ ID de solicitud no válido:",
        id
      );

      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {
      setProcesando(id);

      console.log(
        "🟡 Enviando petición PUT..."
      );

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/aprobar`
      );

      console.log(
        "✅ RESPUESTA DEL SERVIDOR:",
        res.data
      );

      alert(
        res.data?.message ||
          "Solicitud aprobada correctamente."
      );

      console.log(
        "🔵 Actualizando lista..."
      );

      await cargarSolicitudes();

    } catch (error) {
      console.error(
        "❌ ERROR AL APROBAR SOLICITUD:",
        error
      );

      console.error(
        "❌ STATUS:",
        error.response?.status
      );

      console.error(
        "❌ RESPUESTA DEL SERVIDOR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Error al aprobar la solicitud."
      );

    } finally {
      setProcesando(null);
    }
  };

  /* =========================================================
     RECHAZAR
  ========================================================= */

  const rechazar = async (id) => {
    console.log(
      "===================================="
    );

    console.log(
      "🔴 CLICK EN RECHAZAR"
    );

    console.log(
      "🔴 ID DE SOLICITUD:",
      id
    );

    console.log(
      "===================================="
    );

    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      console.error(
        "❌ ID de solicitud no válido:",
        id
      );

      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {
      setProcesando(id);

      console.log(
        "🟡 Enviando petición PUT para rechazar..."
      );

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/rechazar`
      );

      console.log(
        "✅ RESPUESTA RECHAZAR:",
        res.data
      );

      alert(
        res.data?.message ||
          "Solicitud rechazada correctamente."
      );

      console.log(
        "🔵 Actualizando lista..."
      );

      await cargarSolicitudes();

    } catch (error) {
      console.error(
        "❌ ERROR AL RECHAZAR:",
        error
      );

      console.error(
        "❌ STATUS:",
        error.response?.status
      );

      console.error(
        "❌ RESPUESTA:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Error al rechazar la solicitud."
      );

    } finally {
      setProcesando(null);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="crud-container">

      <h2>
        Solicitudes de Actualización
      </h2>

      {/* =====================================================
          SIN SOLICITUDES
      ===================================================== */}

      {solicitudes.length === 0 && (
        <p>
          No hay solicitudes de actualización.
        </p>
      )}

      {/* =====================================================
          SOLICITUDES
      ===================================================== */}

      {solicitudes.map((s) => {
        let datosActuales = {};
        let datosNuevos = {};
        let documentos = [];

        /* ===================================================
           DATOS ACTUALES
        =================================================== */

        try {
          datosActuales =
            typeof s.datosActuales === "string"
              ? JSON.parse(s.datosActuales)
              : s.datosActuales || {};
        } catch (error) {
          console.error(
            "❌ Error leyendo datosActuales:",
            error
          );

          datosActuales = {};
        }

        /* ===================================================
           DATOS NUEVOS
        =================================================== */

        try {
          datosNuevos =
            typeof s.datosNuevos === "string"
              ? JSON.parse(s.datosNuevos)
              : s.datosNuevos || {};
        } catch (error) {
          console.error(
            "❌ Error leyendo datosNuevos:",
            error
          );

          datosNuevos = {};
        }

        /* ===================================================
           DOCUMENTOS
        =================================================== */

        try {
          documentos =
            typeof s.documentos === "string"
              ? JSON.parse(s.documentos)
              : Array.isArray(s.documentos)
              ? s.documentos
              : [];
        } catch (error) {
          console.error(
            "❌ Error leyendo documentos:",
            error
          );

          documentos = [];
        }

        return (
          <div
            key={s.id}
            className="solicitud-card"
          >

            {/* =================================================
                CABECERA
            ================================================= */}

            <div className="cabecera">

              <h3>
                {s.user?.nombres ||
                  "Sin nombre"}{" "}
                {s.user?.apellidos || ""}
              </h3>

              <span
                className={`estado ${s.estado}`}
              >
                {s.estado}
              </span>

            </div>

            {/* =================================================
                INFORMACIÓN GENERAL
            ================================================= */}

            <div className="info-general">

              <p>
                <strong>
                  ID Solicitud:
                </strong>{" "}
                {s.id}
              </p>

              <p>
                <strong>
                  Documento:
                </strong>{" "}
                {s.user?.documento || "-"}
              </p>

              <p>
                <strong>
                  Ficha:
                </strong>{" "}
                {s.user?.ficha || "-"}
              </p>

              <p>
                <strong>
                  Tipo:
                </strong>{" "}
                {s.tipo || "-"}
              </p>

            </div>

            {/* =================================================
                COMPARACIÓN
            ================================================= */}

            <div className="comparacion">

              {/* DATOS ACTUALES */}

              <div>

                <h4>
                  Datos actuales
                </h4>

                {Object.keys(datosActuales)
                  .length === 0 ? (

                  <p>
                    No hay datos registrados.
                  </p>

                ) : (

                  Object.entries(
                    datosActuales
                  ).map(([k, v]) => (

                    <div
                      key={k}
                      className="dato"
                    >

                      <strong>
                        {k}
                      </strong>

                      <span>
                        {v !== undefined &&
                        v !== null &&
                        v !== ""
                          ? String(v)
                          : "-"}
                      </span>

                    </div>

                  ))
                )}

              </div>

              {/* DATOS NUEVOS */}

              <div>

                <h4>
                  Datos nuevos
                </h4>

                {Object.keys(datosNuevos)
                  .length === 0 ? (

                  <p>
                    No hay datos nuevos.
                  </p>

                ) : (

                  Object.entries(
                    datosNuevos
                  ).map(([k, v]) => (

                    <div
                      key={k}
                      className="dato"
                    >

                      <strong>
                        {k}
                      </strong>

                      <span>
                        {v !== undefined &&
                        v !== null &&
                        v !== ""
                          ? String(v)
                          : "-"}
                      </span>

                    </div>

                  ))
                )}

              </div>

            </div>

            {/* =================================================
                FOTO NUEVA
            ================================================= */}

            {s.fotoNueva && (
              <div className="foto">

                <h4>
                  Nueva Foto
                </h4>

                <img
                  src={`http://localhost:3000/${String(
                    s.fotoNueva
                  ).replace(/\\/g, "/")}`}
                  alt="Nueva"
                />

              </div>
            )}

            {/* =================================================
                DOCUMENTOS
            ================================================= */}

            {documentos.length > 0 && (
              <div>

                <h4>
                  Documentos anexos
                </h4>

                {documentos.map(
                  (d, i) => (
                    <div
                      key={i}
                      className="documento"
                    >

                      <span>
                        {d.nombre ||
                          `Documento ${i + 1}`}
                      </span>

                      {d.ruta && (
                        <a
                          href={`http://localhost:3000/${String(
                            d.ruta
                          ).replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

            {/* =================================================
                ACCIONES
            ================================================= */}

            {s.estado === "pendiente" && (
              <div className="acciones">

                {/* APROBAR */}

                <button
                  type="button"
                  className="aprobar"
                  disabled={
                    procesando !== null
                  }
                  onMouseDown={() => {
                    console.log(
                      "🟣 MOUSE DOWN APROBAR - ID:",
                      s.id
                    );
                  }}
                  onClick={() => {
                    console.log(
                      "🟢 CLICK BOTÓN APROBAR - ID:",
                      s.id
                    );

                    aprobar(s.id);
                  }}
                >
                  {procesando === s.id
                    ? "Procesando..."
                    : "Aprobar"}
                </button>

                {/* RECHAZAR */}

                <button
                  type="button"
                  className="rechazar"
                  disabled={
                    procesando !== null
                  }
                  onMouseDown={() => {
                    console.log(
                      "🟠 MOUSE DOWN RECHAZAR - ID:",
                      s.id
                    );
                  }}
                  onClick={() => {
                    console.log(
                      "🔴 CLICK BOTÓN RECHAZAR - ID:",
                      s.id
                    );

                    rechazar(s.id);
                  }}
                >
                  {procesando === s.id
                    ? "Procesando..."
                    : "Rechazar"}
                </button>

              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}


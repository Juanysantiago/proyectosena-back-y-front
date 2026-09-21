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
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await axiosClient.get(
        "/api/solicitudes-actualizacion"
      );

      setSolicitudes(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {
      console.error(
        "Error cargando solicitudes:",
        error
      );

      setSolicitudes([]);
    }
  };

  /* =========================================================
     APROBAR
  ========================================================= */

  const aprobar = async (id) => {

    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {

      setProcesando(id);

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/aprobar`
      );

      alert(
        res.data?.message ||
        "Solicitud aprobada correctamente."
      );

      await cargarSolicitudes();

    } catch (error) {

      console.error(
        "Error al aprobar:",
        error
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

    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {

      setProcesando(id);

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/rechazar`
      );

      alert(
        res.data?.message ||
        "Solicitud rechazada correctamente."
      );

      await cargarSolicitudes();

    } catch (error) {

      console.error(
        "Error al rechazar:",
        error
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

      {/* =====================================================
          TITULO
      ===================================================== */}

      <div className="titulo-card">

        <h2>
          Solicitudes de Actualización
        </h2>

      </div>


      {/* =====================================================
          SIN SOLICITUDES
      ===================================================== */}

      {solicitudes.length === 0 && (

        <div className="sin-solicitudes">

          <p>
            No hay solicitudes de actualización.
          </p>

        </div>

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
            "Error leyendo datos actuales:",
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
            "Error leyendo datos nuevos:",
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
            "Error leyendo documentos:",
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
                  "Sin nombre"}

                {" "}

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
                </strong>

                {" "}

                {s.id}

              </p>


              <p>

                <strong>
                  Documento:
                </strong>

                {" "}

                {s.user?.documento || "-"}

              </p>


              <p>

                <strong>
                  Ficha:
                </strong>

                {" "}

                {s.user?.ficha || "-"}

              </p>


              <p>

                <strong>
                  Tipo:
                </strong>

                {" "}

                {s.tipo || "-"}

              </p>

            </div>


            {/* =================================================
                COMPARACIÓN
            ================================================= */}

            <div className="comparacion">


              {/* DATOS ACTUALES */}

              <div className="bloque-datos">

                <h4>
                  Datos actuales
                </h4>


                {Object.keys(datosActuales).length === 0 ? (

                  <p className="sin-datos">
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

              <div className="bloque-datos">

                <h4>
                  Datos nuevos
                </h4>


                {Object.keys(datosNuevos).length === 0 ? (

                  <p className="sin-datos">
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

              <div className="documentos">

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
                  onClick={() =>
                    aprobar(s.id)
                  }
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
                  onClick={() =>
                    rechazar(s.id)
                  }
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
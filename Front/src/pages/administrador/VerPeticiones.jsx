import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/administrador/verPeticiones.css";
import GenerarCarnet from "./GenerarCarnet";

export default function VerPeticiones() {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarSolicitudes = async () => {
    try {
      const res = await axiosClient.get("/api/solicitudes-carnet");
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar las solicitudes");
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const aprobar = async (id) => {
    try {
      await axiosClient.put(`/api/solicitudes-carnet/${id}/aprobar`);
      cargarSolicitudes();
    } catch (error) {
      console.error(error);
      alert("Error al aprobar");
    }
  };

  const rechazar = async (id) => {
    try {
      await axiosClient.put(`/api/solicitudes-carnet/${id}/rechazar`);
      cargarSolicitudes();
    } catch (error) {
      console.error(error);
      alert("Error al rechazar");
    }
  };

  return (
    <div className="peticiones-page">

      <div className="content-box">

        <h1>Solicitudes de Carnet</h1>

        <div className="tabla-contenedor">

          <table className="tablaSolicitudes">

            <thead>
              <tr>
                <th>Documento</th>
                <th>Aprendiz</th>
                <th>Ficha</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Color</th>
                <th>Serial / Placa</th>
                <th>Cilindraje</th>
                <th>Modelo</th>
                <th>Estado</th>
                <th>Foto Aprendiz</th>
                <th>Foto Vehículo</th>
                <th>Formato</th>
                <th>Anexos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {solicitudes.length > 0 ? (

                solicitudes.map((s) => (

                  <tr key={s.id}>

                    <td>
                      {s.user?.documento || "-"}
                    </td>

                    <td>
                      {s.user?.nombres || ""}{" "}
                      {s.user?.apellidos || ""}
                    </td>

                    <td>
                      {s.user?.ficha || "-"}
                    </td>

                    <td>
                      {s.tipoVehiculo || "-"}
                    </td>

                    <td>
                      {s.marca || "-"}
                    </td>

                    <td>
                      {s.color || "-"}
                    </td>

                    <td>
                      {s.serialPlaca || "-"}
                    </td>

                    <td>
                      {s.cilindraje || "-"}
                    </td>

                    <td>
                      {s.modelo || "-"}
                    </td>

                    {/* ESTADO */}

                    <td>

                      {s.estado === "pendiente" && (
                        <strong className="estado pendiente">
                          ⏳ Pendiente
                        </strong>
                      )}

                      {s.estado === "aprobada" && (
                        <strong className="estado aprobada">
                          🟢 Aprobada
                        </strong>
                      )}

                      {s.estado === "rechazada" && (
                        <strong className="estado rechazada">
                          ❌ Rechazada
                        </strong>
                      )}

                      {s.estado === "carnet_generado" && (
                        <strong className="estado generado">
                          ⚡ Carnet generado
                        </strong>
                      )}

                    </td>

                    {/* FOTO APRENDIZ */}

                    <td>

                      {s.fotoAprendiz ? (

                        <a
                          href={`http://localhost:3000/uploads/${s.fotoAprendiz}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver Foto
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>

                    {/* FOTO VEHÍCULO */}

                    <td>

                      {s.fotoVehiculo ? (

                        <a
                          href={`http://localhost:3000/uploads/${s.fotoVehiculo}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver Foto
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>

                    {/* FORMATO */}

                    <td>

                      {s.formatoDiligenciado ? (

                        <a
                          href={`http://localhost:3000/uploads/${s.formatoDiligenciado}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver Archivo
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>

                    {/* ANEXOS */}

                    <td>

                      {s.documentosAnexos ? (

                        <a
                          href={`http://localhost:3000/uploads/${s.documentosAnexos}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver Archivo
                        </a>

                      ) : (
                        "Sin anexos"
                      )}

                    </td>

                    {/* ACCIONES */}

                    <td className="acciones">

                      {s.estado === "pendiente" && (
                        <>
                          <button
                            className="btn-aprobar"
                            onClick={() => aprobar(s.id)}
                          >
                            Aprobar
                          </button>

                          <button
                            className="btn-rechazar"
                            onClick={() => rechazar(s.id)}
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {s.estado === "aprobada" && (

                        <div className="generar-carnet">

                          <GenerarCarnet
                            solicitud={s}
                          />

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="15"
                    className="sin-solicitudes"
                  >
                    No hay solicitudes registradas
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
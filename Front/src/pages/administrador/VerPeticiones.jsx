import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/administrador/verPeticiones.css";

export default function VerPeticiones() {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarSolicitudes = async () => {
    try {
     const res = await axiosClient.get("/api/solicitudes-carnet");

console.log(res.data);

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
    }
  };

  const rechazar = async (id) => {
    try {
      await axiosClient.put(`/api/solicitudes-carnet/${id}/rechazar`);
      cargarSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-box">
      <h1>Solicitudes de Carnet</h1>

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
          {solicitudes.map((s) => (
            <tr key={s.id}>

              <td>{s.user?.documento}</td>

<td>{s.user?.nombres} {s.user?.apellidos}</td>

<td>{s.user?.ficha}</td>

              <td>{s.tipoVehiculo}</td>

              <td>{s.marca}</td>

              <td>{s.color}</td>

              <td>{s.serialPlaca}</td>

              <td>{s.cilindraje || "-"}</td>

              <td>{s.modelo || "-"}</td>

              <td>{s.estado}</td>

              <td>
                <a
                  href={`http://localhost:3000/uploads/${s.fotoAprendiz}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver Foto
                </a>
              </td>

              <td>
                <a
                  href={`http://localhost:3000/uploads/${s.fotoVehiculo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver Foto
                </a>
              </td>

              <td>
                <a
                  href={`http://localhost:3000/uploads/${s.formatoDiligenciado}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver Archivo
                </a>
              </td>

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

              <td>
                {s.estado === "pendiente" ? (
                  <>
                    <button onClick={() => aprobar(s.id)}>
                      Aprobar
                    </button>

                    <button
                      style={{ marginLeft: 5 }}
                      onClick={() => rechazar(s.id)}
                    >
                      Rechazar
                    </button>
                  </>
                ) : (
                  <strong>
                    {s.estado === "aprobada"
                      ? "✅ Aprobada"
                      : "❌ Rechazada"}
                  </strong>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
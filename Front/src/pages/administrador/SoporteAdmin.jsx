import { useEffect, useState } from "react";

import {
  obtenerTodosSoportes,
  responderSoporte,
} from "../../api/soporteApi";

import "../../Styles/administrador/SoporteAdmin.css";

export default function SoporteAdmin() {
  const [soportes, setSoportes] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerTodosSoportes();

      setSoportes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Error cargando solicitudes");
      setSoportes([]);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async (ticket) => {
    try {
      await responderSoporte(ticket.id, {
        respuesta: ticket.respuesta,
        estado: ticket.estado,
      });

      alert("Soporte actualizado correctamente");

      cargar();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el soporte");
    }
  };

  return (
    <div className="adminSoporte">
      <h2>Solicitudes de Soporte</h2>

      {soportes.length === 0 ? (
        <p>No hay solicitudes de soporte.</p>
      ) : (
        soportes.map((ticket) => (
          <div
            className="cardSoporte"
            key={ticket.id}
          >
            <h3>
              {ticket.user?.nombres} {ticket.user?.apellidos}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {ticket.user?.email}
            </p>

            <p>
              <strong>Ficha:</strong>{" "}
              {ticket.user?.ficha}
            </p>

            <p>
              <strong>Asunto:</strong>{" "}
              {ticket.asunto}
            </p>

            <p>
              <strong>Descripción:</strong>
            </p>

            <p>{ticket.descripcion}</p>

            <label>Estado</label>

            <select
              value={ticket.estado}
              onChange={(e) => {
                const copia = [...soportes];

                const index = copia.findIndex(
                  (x) => x.id === ticket.id
                );

                copia[index].estado =
                  e.target.value;

                setSoportes(copia);
              }}
            >
              <option value="Pendiente">
                Pendiente
              </option>

              <option value="En proceso">
                En proceso
              </option>

              <option value="Resuelto">
                Resuelto
              </option>
            </select>

            <label>Respuesta</label>

            <textarea
              placeholder="Escriba una respuesta..."
              value={ticket.respuesta || ""}
              onChange={(e) => {
                const copia = [...soportes];

                const index = copia.findIndex(
                  (x) => x.id === ticket.id
                );

                copia[index].respuesta =
                  e.target.value;

                setSoportes(copia);
              }}
            />

            <button
              onClick={() => guardar(ticket)}
            >
              Guardar respuesta
            </button>
          </div>
        ))
      )}
    </div>
  );
}
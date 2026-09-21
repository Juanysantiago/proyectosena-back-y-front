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

  const cambiarEstado = (id, estado) => {
    const copia = [...soportes];

    const index = copia.findIndex(
      (x) => x.id === id
    );

    if (index !== -1) {
      copia[index].estado = estado;
      setSoportes(copia);
    }
  };

  const cambiarRespuesta = (id, respuesta) => {
    const copia = [...soportes];

    const index = copia.findIndex(
      (x) => x.id === id
    );

    if (index !== -1) {
      copia[index].respuesta = respuesta;
      setSoportes(copia);
    }
  };

  return (
    <div className="adminSoporte">

      {/* ==============================
          TITULO
      ============================== */}

      <div className="soporte-titulo">
        <h2>Solicitudes de Soporte</h2>

        <p>
          Gestiona y responde las solicitudes de los aprendices
        </p>
      </div>

      {/* ==============================
          SOLICITUDES
      ============================== */}

      {soportes.length === 0 ? (
        <div className="soporte-vacio">
          <p>
            No hay solicitudes de soporte.
          </p>
        </div>
      ) : (
        soportes.map((ticket) => (
          <div
            className="cardSoporte"
            key={ticket.id}
          >

            {/* ==============================
                USUARIO
            ============================== */}

            <h3>
              {ticket.user?.nombres}{" "}
              {ticket.user?.apellidos}
            </h3>

            <div className="informacion-soporte">

              <p>
                <strong>Email:</strong>{" "}
                {ticket.user?.email || "-"}
              </p>

              <p>
                <strong>Ficha:</strong>{" "}
                {ticket.user?.ficha || "-"}
              </p>

              <p>
                <strong>Asunto:</strong>{" "}
                {ticket.asunto || "-"}
              </p>

            </div>

            {/* ==============================
                DESCRIPCION
            ============================== */}

            <div className="descripcion-soporte">

              <h4>Descripción</h4>

              <p>
                {ticket.descripcion || "Sin descripción"}
              </p>

            </div>

            {/* ==============================
                ESTADO
            ============================== */}

            <div className="campo-soporte">

              <label>Estado</label>

              <select
                value={ticket.estado}
                onChange={(e) =>
                  cambiarEstado(
                    ticket.id,
                    e.target.value
                  )
                }
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

            </div>

            {/* ==============================
                RESPUESTA
            ============================== */}

            <div className="campo-soporte">

              <label>Respuesta</label>

              <textarea
                placeholder="Escriba una respuesta..."
                value={ticket.respuesta || ""}
                onChange={(e) =>
                  cambiarRespuesta(
                    ticket.id,
                    e.target.value
                  )
                }
              />

            </div>

            {/* ==============================
                BOTON
            ============================== */}

            <div className="acciones-soporte">

              <button
                onClick={() => guardar(ticket)}
              >
                Guardar respuesta
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import {
  crearSoporte,
  obtenerMisSoportes,
} from "../../api/soporteApi";

import "../../Styles/aprendiz/SoporteTecnico.css";

export default function SoporteTecnico() {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [soportes, setSoportes] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerMisSoportes();
      setSoportes(data);
    } catch (error) {
      console.error("Error cargando soportes:", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      await crearSoporte({
        asunto,
        descripcion,
      });

      setAsunto("");
      setDescripcion("");

      await cargar();

      alert("Solicitud enviada correctamente.");

    } catch (error) {
      console.error(error);
      alert("Error al enviar la solicitud.");
    }
  };

  return (
    <div className="soporte-container">
      <h2>Soporte Técnico</h2>

      <form
        onSubmit={enviar}
        className="soporte-form"
      >
        <input
          type="text"
          placeholder="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe tu problema"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <button type="submit">
          Enviar solicitud
        </button>
      </form>

      <h3>Mis solicitudes</h3>

      {soportes.length === 0 ? (
        <p>No has enviado solicitudes de soporte.</p>
      ) : (
        soportes.map((item) => (
          <div
            key={item.id}
            className="ticket"
          >
            <div className={`estado ${item.estado}`}>
              {item.estado}
            </div>

            <h4>{item.asunto}</h4>

            <p>{item.descripcion}</p>

            {item.respuesta && (
              <div className="respuesta">
                <strong>Respuesta del administrador:</strong>
                <br />
                {item.respuesta}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
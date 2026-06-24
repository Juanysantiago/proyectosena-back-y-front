import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";

export default function InicioAprendiz() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await axiosClient.get(
        "/api/notificaciones"
      );

      setNotificaciones(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Inicio</h2>

      <p>
        Bienvenido al sistema SENA Parking.
      </p>

      {notificaciones.length > 0 && (
        <>
          <h3>Notificaciones</h3>

          {notificaciones.map((n) => (
            <div
              key={n.id}
              style={{
                background: "#f5f5f5",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                borderLeft: "4px solid green"
              }}
            >
              <p>{n.mensaje}</p>

              <small>
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </small>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
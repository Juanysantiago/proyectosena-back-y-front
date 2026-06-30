import { useEffect, useState } from "react";
import { obtenerReportesRecibidos } from "../../api/soporteApi";

export default function ReportesRecibidos() {

  const [reportes, setReportes] = useState([]);

  const cargar = async () => {

    try {

      const data = await obtenerReportesRecibidos();

      setReportes(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    cargar();

  }, []);

  return (

    <div className="content-box">

      <h2>Reportes Recibidos</h2>

      {

        reportes.length === 0 ?

          (

            <p>No existen reportes recibidos.</p>

          )

          :

          reportes.map((item) => (

            <div
              key={item.id}
              className="ticket"
            >

              <h4>{item.asunto}</h4>

              <p>

                <strong>Aprendiz:</strong>{" "}

                {item.user.nombres} {item.user.apellidos}

              </p>

              <p>

                <strong>Correo:</strong>{" "}

                {item.user.email}

              </p>

              <p>

                <strong>Solicitud:</strong>

              </p>

              <p>{item.descripcion}</p>

              <hr />

              <strong>Respuesta enviada</strong>

              <p>{item.respuesta}</p>

            </div>

          ))

      }

    </div>

  );

}
import { useEffect, useState } from "react";
import { obtenerMiCarnet } from "../../api/carnetApi";
import "../../styles/aprendiz/visualizarCarnet.css";

export default function VisualizarCarnet() {
  const [carnet, setCarnet] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const cargar = async () => {
      try {
        const res = await obtenerMiCarnet(user.id);
        setCarnet(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    cargar();
  }, []);

  if (!carnet) {
    return <p>No tienes carnet generado aún</p>;
  }

  return (
    <div>
      <div className="carnet-wrapper">

        {/* HEADER */}
        <div className="carnet-header">
          SERVICIO NACIONAL DE APRENDIZAJE - SENA
        </div>

        {/* FOTO */}
        <div className="carnet-foto">
          <img
            src={`http://localhost:3000/uploads/${carnet.foto}`}
            alt="foto"
          />
        </div>

        {/* INFO */}
        <div className="carnet-info">
          <p><b>Nombre:</b> {carnet.nombre}</p>
          <p><b>Documento:</b> {carnet.documento}</p>
          <p><b>Ficha:</b> {carnet.ficha}</p>
          <p><b>Tipo:</b> {carnet.tipoVehiculo}</p>
          <p><b>Estado:</b> ACTIVO</p>
        </div>

        {/* QR */}
        <div className="carnet-qr">
          <img
            src={carnet.qr}
            alt="QR"
          />
        </div>

        {/* FOOTER */}
        <div className="carnet-footer">
          VÁLIDO DENTRO DEL CENTRO DE FORMACIÓN
        </div>

      </div>

      {/* BOTÓN IMPRESIÓN */}
      <button
        onClick={() => window.print()}
        style={{ marginTop: 15 }}
      >
        Imprimir Carnet
      </button>
    </div>
  );
}
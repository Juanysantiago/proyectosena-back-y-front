import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/guarda/EscanearQR.css";

export default function EscanearQR() {
  const [escaneando, setEscaneando] = useState(false);
  const [carnet, setCarnet] = useState(null);

  const iniciarEscaneo = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      await html5QrCode.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          await html5QrCode.stop();
          setEscaneando(false);

          try {
            const { data } = await axiosClient.post(
  "/api/carnet/escanear",
  {
    codigoQr: decodedText,
  }
);

setCarnet(data);

            setCarnet(data);

            alert(
              `Registro de ${data.movimiento} realizado correctamente`
            );
          } catch (error) {
            console.error(error);

            alert(
              error.response?.data?.message ||
                "Error al consultar el carnet"
            );
          }
        },
        () => {}
      );

      setEscaneando(true);
    } catch (error) {
      console.error(error);
      alert("No fue posible abrir la cámara");
    }
  };

  useEffect(() => {
    return () => {
      const reader = document.getElementById("reader");

      if (reader) {
        reader.innerHTML = "";
      }
    };
  }, []);

  console.log(carnet);

  return (
    <div className="escanear-container">
      <h2 className="titulo-qr">
        ESCANEAR QR
      </h2>

      {!escaneando && (
        <>
          <img
            src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
            alt="Cámara"
            className="camara-imagen"
          />

          <button
            className="btn-escanear"
            onClick={iniciarEscaneo}
          >
            ESCANEAR
          </button>
        </>
      )}

      <div id="reader"></div>

      {carnet && (
        <div className="resultado-qr">
          <h3>{carnet.movimiento.toUpperCase()}</h3>
<div className="imagenes-qr">
  <img
    src={`http://localhost:3000/uploads/${carnet.carnet.fotoAprendiz}`}
    alt="Aprendiz"
    className="foto-aprendiz"
  />

  <img
    src={`http://localhost:3000/uploads/${carnet.carnet.fotoVehiculo}`}
    alt="Vehículo"
    className="foto-vehiculo"
  />
</div>

          <p><strong>Nombre:</strong> {carnet.carnet.nombre}</p>

          <p><strong>Documento:</strong> {carnet.carnet.documento}</p>

          <p><strong>Ficha:</strong> {carnet.carnet.ficha}</p>

          <p><strong>Correo:</strong> {carnet.carnet.correo}</p>

          <p><strong>Celular:</strong> {carnet.carnet.celular}</p>

          <p><strong>Centro:</strong> {carnet.carnet.centroFormacion}</p>

          <p><strong>Vehículo:</strong> {carnet.carnet.tipoVehiculo}</p>

          <p><strong>Marca:</strong> {carnet.carnet.marca}</p>

          <p><strong>Placa:</strong> {carnet.carnet.placa}</p>

          <p><strong>Serial:</strong> {carnet.carnet.serial}</p>
        </div>
      )}
    </div>
  );
}
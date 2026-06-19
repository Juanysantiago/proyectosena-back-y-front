import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../../styles/guarda/EscanearQR.css";

export default function EscanearQR() {
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState("");

  const iniciarEscaneo = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      await html5QrCode.start(
        {
          facingMode: "environment"
        },
        {
          fps: 10,
          qrbox: 250
        },
        async (decodedText) => {
          setResultado(decodedText);

          await html5QrCode.stop();
          setEscaneando(false);

          alert(`QR detectado:\n${decodedText}`);
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

      {resultado && (
        <div className="resultado-qr">
          <h3>Resultado:</h3>
          <p>{resultado}</p>
        </div>
      )}
    </div>
  );
}
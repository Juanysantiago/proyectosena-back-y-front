import { useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/aprendiz/peticionCarnet.css";

export default function PeticionCarnet() {
  const [serialPlaca, setSerialPlaca] = useState("");

  const [fotoAprendiz, setFotoAprendiz] = useState(null);
  const [fotoVehiculo, setFotoVehiculo] = useState(null);
  const [formatoDiligenciado, setFormatoDiligenciado] = useState(null);
  const [documentosAnexos, setDocumentosAnexos] = useState(null);

  const [loading, setLoading] = useState(false);

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("serialPlaca", serialPlaca);
      formData.append("fotoAprendiz", fotoAprendiz);
      formData.append("fotoVehiculo", fotoVehiculo);
      formData.append("formatoDiligenciado", formatoDiligenciado);

      if (documentosAnexos) {
        formData.append("documentosAnexos", documentosAnexos);
      }

      await axiosClient.post(
  "/api/solicitudes-carnet",
  formData
);

      alert("Solicitud enviada correctamente.");

      setSerialPlaca("");
      setFotoAprendiz(null);
      setFotoVehiculo(null);
      setFormatoDiligenciado(null);
      setDocumentosAnexos(null);

      document.getElementById("fotoAprendiz").value = "";
      document.getElementById("fotoVehiculo").value = "";
      document.getElementById("formatoDiligenciado").value = "";
      document.getElementById("documentosAnexos").value = "";

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Error al enviar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="peticion-container">

      <h2>Solicitud de Carnet</h2>

      <form onSubmit={enviarSolicitud}>

        <label>Serial o placa</label>

        <input
          type="text"
          value={serialPlaca}
          onChange={(e) =>
            setSerialPlaca(e.target.value)
          }
          required
        />

        <label>Foto del aprendiz</label>

        <input
          id="fotoAprendiz"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFotoAprendiz(e.target.files[0])
          }
          required
        />

        <label>Foto del vehículo</label>

        <input
          id="fotoVehiculo"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFotoVehiculo(e.target.files[0])
          }
          required
        />

        <label>Formato diligenciado</label>

        <input
          id="formatoDiligenciado"
          type="file"
          onChange={(e) =>
            setFormatoDiligenciado(e.target.files[0])
          }
          required
        />

        <label>Documentos anexos</label>

        <input
          id="documentosAnexos"
          type="file"
          onChange={(e) =>
            setDocumentosAnexos(e.target.files[0])
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Enviando..."
            : "Enviar Solicitud"}
        </button>

      </form>

    </div>
  );
}
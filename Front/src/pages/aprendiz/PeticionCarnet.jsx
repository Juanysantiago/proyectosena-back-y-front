import { useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/aprendiz/peticionCarnet.css";

export default function PeticionCarnet() {

  const [tipoVehiculo, setTipoVehiculo] = useState("bicicleta");

  const [marca, setMarca] = useState("");
  const [color, setColor] = useState("");
  const [serialPlaca, setSerialPlaca] = useState("");
  const [cilindraje, setCilindraje] = useState("");
  const [modelo, setModelo] = useState("");

  const [fotoAprendiz, setFotoAprendiz] = useState(null);
  const [fotoVehiculo, setFotoVehiculo] = useState(null);
  const [formatoDiligenciado, setFormatoDiligenciado] = useState(null);
  const [documentosAnexos, setDocumentosAnexos] = useState(null);

  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

 const enviarSolicitud = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("tipoVehiculo", tipoVehiculo);
    formData.append("marca", marca);
    formData.append("color", color);
    formData.append("serialPlaca", serialPlaca);
    formData.append("cilindraje", cilindraje);
    formData.append("modelo", modelo);

    formData.append("fotoAprendiz", fotoAprendiz);
    formData.append("fotoVehiculo", fotoVehiculo);
    formData.append("formatoDiligenciado", formatoDiligenciado);

    if (documentosAnexos) {
      formData.append("documentosAnexos", documentosAnexos);
    }

    await axiosClient.post("/api/solicitudes-carnet", formData);

    // 👇 AQUÍ VA LO TUYO
    alert("Solicitud enviada correctamente.");
    window.location.reload();

  } catch (error) {

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

<label>Documento</label>

<input
  type="text"
  value={user?.documento || ""}
  disabled
/>

<label>Nombre Completo</label>

<input
  type="text"
  value={`${user?.nombres || ""} ${user?.apellidos || ""}`}
  disabled
/>

<label>Ficha</label>

<input
  type="text"
  value={user?.ficha || ""}
  disabled
/>

        <label>Tipo de vehículo</label>

        <select
          value={tipoVehiculo}
          onChange={(e)=>setTipoVehiculo(e.target.value)}
        >
          <option value="bicicleta">Bicicleta</option>
          <option value="moto">Moto</option>
        </select>

        <label>Marca</label>

        <input
          type="text"
          value={marca}
          onChange={(e)=>setMarca(e.target.value)}
          required
        />

        <label>Color</label>

        <input
          type="text"
          value={color}
          onChange={(e)=>setColor(e.target.value)}
          required
        />

        {tipoVehiculo==="bicicleta" ? (

          <>
            <label>Serial</label>

            <input
              type="text"
              value={serialPlaca}
              onChange={(e)=>setSerialPlaca(e.target.value)}
              required
            />
          </>

        ) : (

          <>

            <label>Placa</label>

            <input
              type="text"
              value={serialPlaca}
              onChange={(e)=>setSerialPlaca(e.target.value)}
              required
            />

            <label>Cilindraje</label>

            <input
              type="text"
              value={cilindraje}
              onChange={(e)=>setCilindraje(e.target.value)}
            />

            <label>Modelo</label>

            <input
              type="text"
              value={modelo}
              onChange={(e)=>setModelo(e.target.value)}
            />

          </>

        )}

        <label>Foto del aprendiz</label>

        <input
          id="fotoAprendiz"
          type="file"
          accept="image/*"
          onChange={(e)=>setFotoAprendiz(e.target.files[0])}
          required
        />

        <label>Foto del vehículo</label>

        <input
          id="fotoVehiculo"
          type="file"
          accept="image/*"
          onChange={(e)=>setFotoVehiculo(e.target.files[0])}
          required
        />

        <label>Formato diligenciado</label>

        <input
          id="formatoDiligenciado"
          type="file"
          onChange={(e)=>setFormatoDiligenciado(e.target.files[0])}
          required
        />

        <label>Documentos anexos</label>

        <input
          id="documentosAnexos"
          type="file"
          onChange={(e)=>setDocumentosAnexos(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Solicitud"}
        </button>

      </form>

    </div>

  );

}
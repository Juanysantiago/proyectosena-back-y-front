import { useState, useEffect } from "react";
import { axiosClient } from "../../api/axiosClient";

export default function ActualizarDatos() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tipo, setTipo] = useState("datos_personales");
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState(null);

  const [formData, setFormData] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    documento: user?.documento || "",
    tipoDocumento: user?.tipoDocumento || "",
    celular: user?.celular || "",
    ficha: user?.ficha || "",
    centroFormacionId: user?.centroFormacionId || "",
    fechaVinculacion: user?.fechaVinculacion || "",
    fechaFinalizacion: user?.fechaFinalizacion || "",

    tipoVehiculo: "",
    marca: "",
    color: "",
    serialPlaca: "",
    cilindraje: "",
    modelo: ""
  });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const res = await axiosClient.get(
        "/api/vehiculos/mis-vehiculos"
      );

      setVehiculos(res.data);
    } catch (error) {
      console.error("Error cargando vehículos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipoVehiculo") {
      const vehiculo = vehiculos.find(
        (v) => v.tipo?.toLowerCase() === value.toLowerCase()
      );

      if (vehiculo) {
        setFormData((prev) => ({
          ...prev,
          tipoVehiculo: value,
          marca: vehiculo.marca || "",
          color: vehiculo.color || "",
          serialPlaca:
            value === "bicicleta"
              ? vehiculo.serial || ""
              : vehiculo.placa || "",
          cilindraje: vehiculo.cilindraje || "",
          modelo: vehiculo.modelo || ""
        }));

      } else {
        setFormData((prev) => ({
          ...prev,
          tipoVehiculo: value,
          marca: "",
          color: "",
          serialPlaca: "",
          cilindraje: "",
          modelo: ""
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    try {
      let datosActuales = {};
      let datosNuevos = {};

      if (tipo === "datos_personales") {
        datosActuales = {
          nombres: user.nombres,
          apellidos: user.apellidos,
          documento: user.documento,
          tipoDocumento: user.tipoDocumento,
          celular: user.celular,
          ficha: user.ficha,
          centroFormacionId: user.centroFormacionId,
          fechaVinculacion: user.fechaVinculacion,
          fechaFinalizacion: user.fechaFinalizacion
        };

        datosNuevos = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          documento: formData.documento,
          tipoDocumento: formData.tipoDocumento,
          celular: formData.celular,
          ficha: formData.ficha,
          centroFormacionId: formData.centroFormacionId,
          fechaVinculacion: formData.fechaVinculacion,
          fechaFinalizacion: formData.fechaFinalizacion
        };
      } else {
        datosNuevos = {
          tipoVehiculo: formData.tipoVehiculo,
          marca: formData.marca,
          color: formData.color,
          serialPlaca: formData.serialPlaca,
          cilindraje: formData.cilindraje,
          modelo: formData.modelo
        };
      }

    const form = new FormData();

form.append("tipo", tipo);

form.append(
  "datosActuales",
  JSON.stringify(datosActuales)
);

form.append(
  "datosNuevos",
  JSON.stringify(datosNuevos)
);

if (nuevaFoto) {
  form.append(
    "fotoNueva",
    nuevaFoto
  );
}

await axiosClient.post(
  "/api/solicitudes-actualizacion",
  form,
  {
    headers: {
      "Content-Type":
        "multipart/form-data"
    }
  }
);

      alert(
        "Solicitud enviada correctamente. El administrador deberá aprobar esta solicitud antes de actualizar el carnet."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Error al enviar solicitud"
      );
    }
  };

  return (
    <div className="peticion-container">
      <h2>Actualizar Datos</h2>

      <label>¿Qué desea actualizar?</label>

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="datos_personales">
          Datos Personales
        </option>

        <option value="datos_vehiculo">
          Datos del Vehículo
        </option>
      </select>

      <form onSubmit={enviarSolicitud}>
        {tipo === "datos_personales" && (
          <>
            <label>Nombres</label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
            />

            <label>Apellidos</label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />

            <label>Documento</label>
            <input
              name="documento"
              value={formData.documento}
              onChange={handleChange}
            />

            <label>Tipo Documento</label>
            <input
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
            />

            <label>Celular</label>
            <input
              name="celular"
              value={formData.celular}
              onChange={handleChange}
            />

            <label>Ficha</label>
            <input
              name="ficha"
              value={formData.ficha}
              onChange={handleChange}
            />

            <label>Fecha Vinculación</label>
            <input
              type="date"
              name="fechaVinculacion"
              value={formData.fechaVinculacion}
              onChange={handleChange}
            />

            <label>Fecha Finalización</label>
            <input
              type="date"
              name="fechaFinalizacion"
              value={formData.fechaFinalizacion}
              onChange={handleChange}
            />
          </>
        )}

        {tipo === "datos_vehiculo" && (
          <>
            <label>Tipo Vehículo</label>

            <select
              name="tipoVehiculo"
              value={formData.tipoVehiculo}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="bicicleta">Bicicleta</option>
              <option value="moto">Moto</option>
            </select>

    

           {formData.tipoVehiculo === "bicicleta" && (
  <>
    <label>Marca</label>
    <input
      name="marca"
      value={formData.marca}
      onChange={handleChange}
    />

    <label>Color</label>
    <input
      name="color"
      value={formData.color}
      onChange={handleChange}
    />

    <label>Serial</label>
    <input
      name="serialPlaca"
      value={formData.serialPlaca}
      onChange={handleChange}
    />

 <label>Nueva Foto de la Bicicleta</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNuevaFoto(e.target.files[0])
  }
/>
  </>
)}

         {formData.tipoVehiculo === "moto" && (
  <>
    <label>Marca</label>
    <input
      name="marca"
      value={formData.marca}
      onChange={handleChange}
    />

    <label>Color</label>
    <input
      name="color"
      value={formData.color}
      onChange={handleChange}
    />

    <label>Placa</label>
    <input
      name="serialPlaca"
      value={formData.serialPlaca}
      onChange={handleChange}
    />

    <label>Cilindraje</label>
    <input
      name="cilindraje"
      value={formData.cilindraje}
      onChange={handleChange}
    />

    <label>Modelo</label>
    <input
      name="modelo"
      value={formData.modelo}
      onChange={handleChange}
    />

   <label>Nueva Foto de la Moto</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNuevaFoto(e.target.files[0])
  }
/>
  </>
)}
          </>
        )}

        <button type="submit">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
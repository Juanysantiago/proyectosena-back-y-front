import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import { obtenerCentros } from "../api/centroFormacionApi";
import "../styles/register.css";

export default function Register() {
  const [rol, setRol] = useState("aprendiz");
  const [centros, setCentros] = useState([]);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "",
    ficha: "",
    celular: "",
    centroFormacionId: "",
    fechaVinculacion: "",
    fechaFinalizacion: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aceptar, setAceptar] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
  const cargarCentros = async () => {
    try {
      const res = await obtenerCentros();
      setCentros(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  cargarCentros();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rol === "aprendiz" && !aceptar) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        documento: formData.documento,
        tipoDocumento: formData.tipoDocumento,
        celular: formData.celular,
        email: formData.email,
        password: formData.password,
        rol
      };

   if (rol === "aprendiz") {
  dataToSend.ficha = formData.ficha;
  dataToSend.centroFormacionId = formData.centroFormacionId;
  dataToSend.fechaVinculacion = formData.fechaVinculacion;
  dataToSend.fechaFinalizacion = formData.fechaFinalizacion;
}

      await axiosClient.post("/auth/register", dataToSend);

      alert(`Registro exitoso. Bienvenido ${formData.nombres}`);

     setFormData({
  nombres: "",
  apellidos: "",
  documento: "",
  tipoDocumento: "",
  ficha: "",
  celular: "",
  centroFormacionId: "",
  fechaVinculacion: "",
  fechaFinalizacion: "",
  email: "",
  password: ""
});

      setAceptar(false);
      window.location.href = "/";
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Selector de rol */}
      <div className="rol-selector">
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="aprendiz">Aprendiz</option>
          <option value="guarda">Guarda</option>
        </select>
      </div>

      {/* Formulario */}
      <div className="register-card">
        <h2>Registro de Usuario - {rol}</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombres :</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />

          <label>Apellidos :</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />

          <label>Documento :</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          />

          <label>Tipo de Documento :</label>
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
            <option value="PAS">PAS</option>
          </select>

          <label>Número de celular :</label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />

          {rol === "aprendiz" && (
  <>
    <label>Ficha :</label>
    <input
      type="text"
      name="ficha"
      value={formData.ficha}
      onChange={handleChange}
      required
    />

    <label>Centro de Formación :</label>
    <select
      name="centroFormacionId"
      value={formData.centroFormacionId}
      onChange={handleChange}
      required
    >
      <option value="">Seleccione...</option>

      {centros.map((centro) => (
        <option key={centro.id} value={centro.id}>
          {centro.nombre}
        </option>
      ))}
    </select>

    <label>Fecha de vinculación al SENA :</label>
    <input
      type="date"
      name="fechaVinculacion"
      value={formData.fechaVinculacion}
      onChange={handleChange}
      required
    />

    <label>Fecha de finalización :</label>
    <input
      type="date"
      name="fechaFinalizacion"
      value={formData.fechaFinalizacion}
      onChange={handleChange}
      required
    />
  </>
)}

          <label>Correo electrónico :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {rol === "aprendiz" && (
            <div className="terminos">
              <input
                type="checkbox"
                checked={aceptar}
                onChange={(e) => setAceptar(e.target.checked)}
              />
              <span>Acepto los términos y condiciones</span>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
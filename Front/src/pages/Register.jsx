import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    documento: "",
    ficha: "",
    nombres: "",
    apellidos: "",
    rol: "aprendiz"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosClient.post("/auth/register", formData);

      setSuccess("Usuario registrado correctamente");

      setFormData({
        email: "",
        password: "",
        documento: "",
        ficha: "",
        nombres: "",
        apellidos: "",
        rol: "aprendiz"
      });

    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
        "Error al registrar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="register-page">
    <div className="register-card">
      <h2 className="register-title">Registro de Usuario</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">

        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="aprendiz">Aprendiz</option>
          <option value="guarda">Guarda</option>
        </select>

        <div className="form-row">
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={formData.nombres}
            onChange={handleChange}
          />

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={formData.documento}
          onChange={handleChange}
        />

        {formData.rol === "aprendiz" && (
          <input
            type="text"
            name="ficha"
            placeholder="Ficha"
            value={formData.ficha}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="register-btn"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

      </form>
    </div>
  </div>
);
}
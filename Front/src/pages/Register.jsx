import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import { obtenerCentros } from "../api/centroFormacionApi";
import "../styles/register.css";

export default function Register() {
  const [rol, setRol] = useState("aprendiz");
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aceptar, setAceptar] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "",
    celular: "",
    ficha: "",
    centroFormacionId: "",
    fechaVinculacion: "",
    fechaFinalizacion: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const cargarCentros = async () => {
      try {
        const res = await obtenerCentros();

        const datos = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setCentros(datos);
      } catch (error) {
        console.error(error);
      }
    };

    cargarCentros();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cambiarRol = (nuevoRol) => {
    setRol(nuevoRol);
    setError("");

    if (nuevoRol === "guarda") {
      setAceptar(false);

      setFormData((prev) => ({
        ...prev,
        ficha: "",
        centroFormacionId: "",
        fechaVinculacion: "",
        fechaFinalizacion: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rol === "aprendiz" && !aceptar) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!formData.tipoDocumento) {
      setError("Selecciona el tipo de documento.");
      return;
    }

    if (
      rol === "aprendiz" &&
      (
        !formData.ficha ||
        !formData.centroFormacionId ||
        !formData.fechaVinculacion ||
        !formData.fechaFinalizacion
      )
    ) {
      setError("Completa todos los datos del aprendiz.");
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
        rol,
      };

      if (rol === "aprendiz") {
        dataToSend.ficha = formData.ficha;
        dataToSend.centroFormacionId =
          formData.centroFormacionId;
        dataToSend.fechaVinculacion =
          formData.fechaVinculacion;
        dataToSend.fechaFinalizacion =
          formData.fechaFinalizacion;
      }

      await axiosClient.post(
        "/auth/register",
        dataToSend
      );

      alert(
        `Registro exitoso. Bienvenido ${formData.nombres}`
      );

      window.location.href = "/login";
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "No fue posible completar el registro."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        {/* TÍTULO */}

        <div className="register-header">
          <h1>CREAR CUENTA</h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* TIPO DE USUARIO */}

          <div className="role-section">

            <label>Tipo de usuario</label>

            <div className="role-buttons">

              <button
                type="button"
                className={
                  rol === "aprendiz"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() => cambiarRol("aprendiz")}
              >
                Aprendiz
              </button>

              <button
                type="button"
                className={
                  rol === "guarda"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() => cambiarRol("guarda")}
              >
                Guarda
              </button>

            </div>

          </div>

          {/* DATOS PERSONALES */}

          <div className="form-section">

            <h3>Datos personales</h3>

            <div className="form-grid">

              <div className="form-group">
                <label>Nombres</label>

                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellidos</label>

                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de documento</label>

                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccionar
                  </option>

                  <option value="CC">
                    Cédula de ciudadanía
                  </option>

                  <option value="TI">
                    Tarjeta de identidad
                  </option>

                  <option value="CE">
                    Cédula de extranjería
                  </option>

                  <option value="PAS">
                    Pasaporte
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Número de documento</label>

                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Número de celular</label>

                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

          {/* DATOS APRENDIZ */}

          {rol === "aprendiz" && (
            <div className="form-section">

              <h3>Información del aprendiz</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Ficha</label>

                  <input
                    type="text"
                    name="ficha"
                    value={formData.ficha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Centro de formación</label>

                  <select
                    name="centroFormacionId"
                    value={formData.centroFormacionId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {centros.map((centro) => (
                      <option
                        key={centro.id}
                        value={centro.id}
                      >
                        {centro.nombre}
                        {centro.ciudad
                          ? ` - ${centro.ciudad}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha de vinculación</label>

                  <input
                    type="date"
                    name="fechaVinculacion"
                    value={formData.fechaVinculacion}
                    onChange={handleChange}
                    max={
                      formData.fechaFinalizacion || undefined
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de finalización</label>

                  <input
                    type="date"
                    name="fechaFinalizacion"
                    value={formData.fechaFinalizacion}
                    onChange={handleChange}
                    min={
                      formData.fechaVinculacion || undefined
                    }
                    required
                  />
                </div>

              </div>
            </div>
          )}

          {/* DATOS DE ACCESO */}

          <div className="form-section">

            <h3>Datos de acceso</h3>

            <div className="form-grid">

              <div className="form-group full">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full">
                <label>Contraseña</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

          {/* TÉRMINOS */}

          {rol === "aprendiz" && (
            <label className="terms">

              <input
                type="checkbox"
                checked={aceptar}
                onChange={(e) =>
                  setAceptar(e.target.checked)
                }
              />

              <span>
                Acepto los términos y condiciones
              </span>

            </label>
          )}

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* CREAR CUENTA */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Registrando..."
              : "CREAR CUENTA"}
          </button>

          {/* VOLVER */}

          <Link
            to="/"
            className="back-home"
          >
            Volver al inicio
          </Link>

        </form>

      </div>

    </div>
  );
}
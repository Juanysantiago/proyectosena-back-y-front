import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import "../styles/verificarCodigo.css";

export default function VerificarCodigo() {
  const [pin, setPin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const email = localStorage.getItem("emailRecuperacion");

  const verificarCodigo = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post(
        "/auth/verificar-pin",
        {
          email,
          pin
        }
      );

      const { accessToken, user } = res.data;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      switch (user.rol) {
        case "administrador":
          window.location.href =
            "/dashboard-admin";
          break;

        case "guarda":
          window.location.href =
            "/dashboard-guarda";
          break;

        case "aprendiz":
          window.location.href =
            "/dashboard-aprendiz";
          break;

        default:
          setError("Rol no reconocido");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Código incorrecto"
      );
    }
  };

  const reenviarCodigo = async () => {
    try {
      await axiosClient.post(
        "/auth/reenviar-pin",
        {
          email
        }
      );

      setMensaje(
        "Se ha enviado un nuevo código."
      );

    } catch (error) {
      setError(
        "No fue posible reenviar el código."
      );
    }
  };

  return (
    <div className="verificar-container">
      <div className="verificar-card">
        <h2>Código de verificación</h2>

        <p>
          Ingrese el PIN de 6 dígitos enviado a
          su correo electrónico.
        </p>

        <form onSubmit={verificarCodigo}>
          <input
            type="text"
            maxLength="6"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value)
            }
            placeholder="000000"
            required
          />

          <button type="submit">
            Verificar
          </button>
        </form>

        {mensaje && (
          <div className="success-message">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className="reenviar-btn"
          onClick={reenviarCodigo}
        >
          Reenviar código
        </button>
      </div>
    </div>
  );
}
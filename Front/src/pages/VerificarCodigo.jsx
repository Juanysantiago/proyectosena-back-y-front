import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import "../styles/verificarCodigo.css";

export default function VerificarCodigo() {
  const [pin, setPin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("emailRecuperacion");

  const verificarCodigo = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!email) {
      setError("No se encontró el correo de recuperación.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError("El PIN debe contener 6 números.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosClient.post(
        "/auth/verificar-pin",
        {
          email: email.trim().toLowerCase(),
          pin: pin,
        }
      );

      console.log("RESPUESTA VERIFICAR PIN:", res.data);

      /*
       * EL BACKEND DEVUELVE:
       *
       * {
       *   message: "Código correcto",
       *   resetToken: "..."
       * }
       */

      const resetToken = res.data?.resetToken;

      if (!resetToken) {
        setError(
          "No se recibió el token de recuperación."
        );
        return;
      }

      // Guardar el token temporal
      localStorage.setItem(
        "tokenRecuperacion",
        resetToken
      );

      // Guardar correo
      localStorage.setItem(
        "emailRecuperacion",
        email.trim().toLowerCase()
      );

      localStorage.setItem(
        "pinVerificado",
        "true"
      );

      setMensaje(
        "Código verificado correctamente."
      );

      setTimeout(() => {
        window.location.href = "/cambiar-contraseña";
      }, 800);

    } catch (err) {
      console.error(
        "ERROR VERIFICANDO PIN:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Código incorrecto."
      );
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    setError("");
    setMensaje("");

    if (!email) {
      setError(
        "No se encontró el correo de recuperación."
      );
      return;
    }

    try {
      setLoading(true);

      await axiosClient.post(
        "/auth/reenviar-pin",
        {
          email: email.trim().toLowerCase(),
        }
      );

      // El PIN anterior deja de ser válido
      localStorage.removeItem(
        "tokenRecuperacion"
      );

      localStorage.removeItem(
        "pinVerificado"
      );

      setPin("");

      setMensaje(
        "Se ha enviado un nuevo código."
      );

    } catch (err) {
      console.error(
        "ERROR REENVIANDO PIN:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "No fue posible reenviar el código."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verificar-container">
      <div className="verificar-card">

        <h2>Código de verificación</h2>

        <p>
          Ingrese el PIN de 6 dígitos enviado
          a su correo electrónico.
        </p>

        <form onSubmit={verificarCodigo}>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) =>
              setPin(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="Código de 6 dígitos"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Verificando..."
              : "Verificar"}
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
          type="button"
          className="reenviar-btn"
          onClick={reenviarCodigo}
          disabled={loading}
        >
          Reenviar código
        </button>

      </div>
    </div>
  );
}
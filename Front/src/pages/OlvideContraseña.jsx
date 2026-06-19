import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function OlvideContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axiosClient.post(
        "/auth/recuperar-password",
        {
          email
        }
      );

      localStorage.setItem(
        "emailRecuperacion",
        email
      );

      setMensaje(
        "Se ha enviado con éxito el PIN de recuperación."
      );

      setTimeout(() => {
        window.location.href =
          "/verificar-codigo";
      }, 1500);

    } catch (error) {
      setMensaje(
        error?.response?.data?.message ||
        "No fue posible enviar el PIN."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#ffffff,#e8f5e9)"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          width: "450px",
          border: "1px solid #4caf50"
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            textAlign: "center"
          }}
        >
          Recuperar contraseña
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
            marginBottom: "25px"
          }}
        >
          Ingrese su correo electrónico. Le enviaremos un PIN de recuperación de 6 dígitos.
        </p>

        <form onSubmit={enviarPin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginBottom: "20px"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {loading
              ? "Enviando..."
              : "Confirmar"}
          </button>
        </form>

        {mensaje && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: "#2e7d32",
              fontWeight: "bold"
            }}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
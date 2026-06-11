import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("aprendiz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/login", {
  email,
  password,
  rol
});

      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify({ ...user, rol }));
if (user.rol === "administrador") {
  window.location.href = "/dashboard-guarda";
} else if (user.rol === "guarda") {
  window.location.href = "/dashboard-guarda";
} else {
  window.location.href = "/dashboard-aprendiz";
}

      alert(`Bienvenido ${user.email} - Rol: ${rol}`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)",
      padding: "20px",
      position: "relative"
    }}>
      {/* Selector de rol en esquina superior derecha */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 100
      }}>
        <select 
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "2px solid #4caf50",
            backgroundColor: "white",
            color: "#2e7d32",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          <option value="aprendiz">aprendiz</option>
          <option value="guarda">guarda</option>
          <option value="administrador">administrador</option>
        </select>
      </div>

      {/* Formulario de login */}
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "40px",
        width: "100%",
        maxWidth: "500px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid #4caf50"
      }}>
      
        <h3 style={{
          color: "#2e7d32",
          fontSize: "1.2rem",
          marginBottom: "25px",
          textAlign: "center"
        }}>INICIAR SESIÓN</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>CORREO :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>CONTRASEÑA :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            fontSize: "0.85rem"
          }}>
            <div>
              ¿No tienes una cuenta? <a href="/registro" style={{ color: "#4caf50", textDecoration: "none" }}>Regístrate</a>
            </div>
            <div>
              <a href="/olvide-contraseña" style={{ color: "#4caf50", textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          {error && <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
            fontSize: "0.85rem"
          }}>{error}</div>}

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
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "10px",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Cargando..." : "INICIAR SESIÓN"}
          </button>
        </form>
      </div>
    </div>
  );
}
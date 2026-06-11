import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import "../styles/register.css";

export default function Register() {
  const [rol, setRol] = useState("aprendiz");
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "",
    ficha: "",
    email: "",
    password: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rol === "aprendiz" && !aceptar) {
      setError("Debes aceptar los términos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        rol
      };
      
      // Si es guarda, eliminamos el campo ficha
      if (rol === "guarda") {
        delete dataToSend.ficha;
      }

const res = await axiosClient.post("/auth/register", dataToSend);
      
      alert(`Registro exitoso. Bienvenido ${formData.nombres}`);
      // Redireccionar a login
      window.location.href = "/login";
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
          <option value="aprendiz">Aprendiz</option>
<option value="guarda">Guarda</option>
<option value="administrador">Administrador</option>
        </select>
      </div>

      {/* Formulario de registro */}
      <div style={{
        background: "white",
        borderRadius: "15px",
        padding: "40px",
        width: "100%",
        maxWidth: "550px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid #4caf50"
      }}>
      
        <h3 style={{
          color: "#2e7d32",
          fontSize: "1.2rem",
          marginBottom: "25px",
          textAlign: "center"
        }}>Registro de Usuario - {rol === "aprendiz" ? "Aprendiz" : "Guarda"}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Nombres :</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Apellidos :</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Documento :</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Tipo de Documento :</label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "0.9rem",
                backgroundColor: "white"
              }}
            >
              <option value="">Seleccione...</option>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PAS">Pasaporte</option>
            </select>
          </div>

          {/* Campo Ficha - solo para Aprendiz */}
          {rol === "aprendiz" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
                color: "#333",
                fontSize: "0.9rem"
              }}>Ficha :</label>
              <input
                type="text"
                name="ficha"
                value={formData.ficha}
                onChange={handleChange}
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
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Correo electrónico :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              marginBottom: "5px",
              fontWeight: "600",
              color: "#333",
              fontSize: "0.9rem"
            }}>Contraseña :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          {/* Checkbox Aceptar - solo para Aprendiz */}
          {rol === "aprendiz" && (
            <div style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <input
                type="checkbox"
                checked={aceptar}
                onChange={(e) => setAceptar(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer"
                }}
              />
              <label style={{
                color: "#333",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}>
                Acepto los términos y condiciones
              </label>
            </div>
          )}

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
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
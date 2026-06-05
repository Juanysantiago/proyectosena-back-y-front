import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function Login() {
  const [email, setEmail] = useState("angel@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/login", { email, password });

      // res.data = { accessToken, user: { email, id } }
      const { accessToken, user } = res.data;

      // Guardar token (y opcionalmente el usuario)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Ejemplo: redireccionar o marcar estado de autenticación
      // navigate("/dashboard");
      alert(`Login OK. Bienvenido ${user.email}`);
    } catch (err) {
      // Manejo típico de error Axios
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
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label>Password</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error ? (
          <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
        ) : null}

        <button disabled={loading} type="submit" style={{ width: "100%", padding: 10 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function Home() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "sans-serif", padding: 16 }}>
      <h1>Inicio</h1>
      <p>Bienvenido. Usa el menú superior para navegar.</p>

      {user ? (
        <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 8 }}>
          <div>
            <strong>Usuario:</strong> {user.email} (id: {user.id})
          </div>
        </div>
      ) : (
        <div style={{ background: "#fff7e6", padding: 12, borderRadius: 8 }}>
          No hay usuario en localStorage. Puedes{" "}
          <Link to="/login">iniciar sesión</Link> o <Link to="/register">registrarte</Link>.
        </div>
      )}

      <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />

      <h3>Accesos rápidos</h3>
      <ul>
        <li>
          <Link to="/login">Ir a Login</Link>
        </li>
        <li>
          <Link to="/register">Ir a Registro</Link>
        </li>
        <li>
          <Link to="/tipo-documentos">Ir a CRUD Tipo Documentos</Link>
        </li>
        <li>
          <Link to="/vehiculos">Ir a vehiculos</Link>
        </li>
      </ul>
    </div>
  );
}
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rol }) {

  const usuarioGuardado = localStorage.getItem("user");

  console.log("ProtectedRoute");
  console.log("Usuario:", usuarioGuardado);
  console.log("Rol requerido:", rol);

  if (!usuarioGuardado) {
    return <Navigate to="/login" replace />;
  }

  let usuario;

  try {
    usuario = JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error("Error leyendo usuario:", error);

    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (!usuario?.id || !usuario?.rol) {
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== rol) {

    if (usuario.rol === "administrador") {
      return <Navigate to="/dashboard-admin" replace />;
    }

    if (usuario.rol === "guarda") {
      return <Navigate to="/dashboard-guarda" replace />;
    }

    if (usuario.rol === "aprendiz") {
      return <Navigate to="/dashboard-aprendiz" replace />;
    }

    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  return children;
}
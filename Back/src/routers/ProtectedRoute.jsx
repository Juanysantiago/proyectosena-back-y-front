import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user")); // guarda el usuario al iniciar sesión

  // si no hay login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // si hay roles definidos y no coincide
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
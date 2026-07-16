import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function ProtectedRoute({ children, rol }) {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const verificar = async () => {

      try {

        const { data } = await axiosClient.get("/auth/me");

        console.log("ROL PROTECTED:", data.rol);

        if (rol && data.rol !== rol) {

          console.log("NO AUTORIZADO");

          setAuthorized(false);

        } else {

          console.log("AUTORIZADO");

          setAuthorized(true);

        }

      } catch (error) {

        console.log("ERROR SESION:", error);

        setAuthorized(false);

      } finally {

        setLoading(false);

      }

    };


    verificar();

  }, [rol]);


  if (loading) {
    return <p>Cargando sesión...</p>;
  }


  if (!authorized) {
    return <Navigate to="/" replace />;
  }


  return children;
}
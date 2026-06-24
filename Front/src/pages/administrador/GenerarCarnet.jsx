import { useState } from "react";
import { carnetApi } from "../../api/carnetApi";

export default function GenerarCarnet({ solicitud }) {
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    if (!solicitud?.id) {
      alert("Solicitud no disponible");
      return;
    }

    try {
      setLoading(true);

      const res = await carnetApi.generar(solicitud.id);

      alert("Carnet generado correctamente");
      console.log(res.data);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Error al generar carnet"
      );

    } finally {
      setLoading(false);
    }
  };

  if (!solicitud?.id) return null;

  return (
    <button
      onClick={handleGenerar}
      disabled={loading}
    >
      {loading ? "Generando..." : "Generar Carnet"}
    </button>
  );
}
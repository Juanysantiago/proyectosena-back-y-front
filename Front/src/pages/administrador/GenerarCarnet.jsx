import { generarCarnet } from "../../api/carnetApi";
import { useState } from "react";

export default function GenerarCarnet({ solicitud }) {
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    // 🔥 PROTECCIÓN ANTI-ERROR
    if (!solicitud?.id) {
      alert("Solicitud no disponible");
      return;
    }

    try {
      setLoading(true);

      const res = await generarCarnet(solicitud.id);

      alert("Carnet generado correctamente");
      console.log(res.data);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Error al generar carnet"
      );

    } finally {
      setLoading(false);
    }
  };

  // 🔥 EVITA RENDER SI NO HAY DATA
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
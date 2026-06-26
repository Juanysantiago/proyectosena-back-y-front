import "../../styles/aprendiz/inicioAprendiz.css";

export default function InicioAprendiz() {
  return (
    <div className="inicio-aprendiz">
      <h2>Bienvenido al sistema SENA Parking</h2>

      <p>
        Desde este panel puedes gestionar tu carnet, actualizar tus datos,
        realizar solicitudes y consultar las notificaciones desde la campana.
      </p>

      <div className="inicio-card">
        <h3>Accesos rápidos</h3>

        <ul>
          <li>📇 Visualizar tu carnet.</li>
          <li>📝 Solicitar un nuevo carnet.</li>
          <li>✏️ Actualizar datos personales o del vehículo.</li>
          <li>🔔 Revisar las notificaciones desde la campana.</li>
        </ul>
      </div>
    </div>
  );
}
import {
  FaIdCard,
  FaCar,
  FaBell,
  FaClipboardList,
  FaUserGraduate,
} from "react-icons/fa";

import "../../styles/aprendiz/inicioAprendiz.css";

export default function InicioAprendiz() {
  return (
    <div className="inicio-aprendiz">

      <div className="hero-inicio">
        <div>
          <h1>¡Bienvenido a SENA Parking!</h1>
          <p>
            Administra tu carnet, tu vehículo y todas tus solicitudes desde un
            solo lugar.
          </p>
        </div>

        <div className="hero-icono">
          <FaUserGraduate />
        </div>
      </div>

      <div className="cards-acceso">

        <div className="acceso-card">
          <FaIdCard className="icono-card" />
          <h3>Mi Carnet</h3>
          <p>Consulta y visualiza tu carnet digital.</p>
        </div>

        <div className="acceso-card">
          <FaClipboardList className="icono-card" />
          <h3>Solicitudes</h3>
          <p>Solicita un nuevo carnet o consulta el estado.</p>
        </div>

        <div className="acceso-card">
          <FaCar className="icono-card" />
          <h3>Vehículo</h3>
          <p>Actualiza la información de tu vehículo.</p>
        </div>

        <div className="acceso-card">
          <FaBell className="icono-card" />
          <h3>Notificaciones</h3>
          <p>Revisa todas las novedades del sistema.</p>
        </div>

      </div>

      <div className="info-box">
        <h2>Accesos rápidos</h2>

        <ul>
          <li>📇 Visualizar tu carnet.</li>
          <li>📝 Solicitar un nuevo carnet.</li>
          <li>🚗 Actualizar información del vehículo.</li>
          <li>🔔 Revisar notificaciones.</li>
        </ul>
      </div>

    </div>
  );
}
import "../../styles/administrador/datosUsuario.css";

export default function DatosUsuarios() {
  return (
    <div className="du-container">

      <div className="du-header">
        <h1>👥 Datos de Usuarios</h1>
        <p>
          Consulta y administra la información de los usuarios registrados
          en SENA Parking.
        </p>
      </div>

      <div className="du-card">
        <h2>Información de Usuarios</h2>

        <div className="du-empty">
          <span>👤</span>
          <p>No hay información de usuarios para mostrar.</p>
        </div>
      </div>

    </div>
  );
}
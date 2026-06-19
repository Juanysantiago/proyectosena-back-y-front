export default function InicioAdmin() {
  return (
    <div className="content-box">
      <h1>Panel Administrativo</h1>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
          gap:"20px",
          marginTop:"20px"
        }}
      >
        <div className="admin-card">
          <h3>Peticiones</h3>
          <p>Gestiona solicitudes de carnet.</p>
        </div>

        <div className="admin-card">
          <h3>Vehículos</h3>
          <p>Administra los tipos de vehículos.</p>
        </div>

        <div className="admin-card">
          <h3>Usuarios</h3>
          <p>Consulta la información registrada.</p>
        </div>
      </div>
    </div>
  );
}
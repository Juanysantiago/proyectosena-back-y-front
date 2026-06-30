import "../../Styles/guarda/InicioGuarda.css"

export default function InicioGuarda() {
  return (
    <div className="inicio-guarda">

      <div className="banner-guarda">
        <h1>🛡️ Bienvenido, Guarda de Seguridad</h1>
        <p>
          Desde este panel podrás controlar el ingreso y salida de los aprendices y sus vehículos de manera rápida y segura mediante el sistema SENA Parking.
        </p>
      </div>

      <div className="cards-guarda">

        <div className="card-guarda">
          <div className="icono">📷</div>
          <h3>Escanear QR</h3>
          <p>Escanea el carnet del aprendiz para validar su información y registrar automáticamente su ingreso o salida.</p>
        </div>

        <div className="card-guarda">
          <div className="icono">🚗</div>
          <h3>Control Vehicular</h3>
          <p>Verifica que la información del vehículo coincida con el registro almacenado en el sistema.</p>
        </div>

        <div className="card-guarda">
          <div className="icono">📋</div>
          <h3>Historial</h3>
          <p>Consulta los movimientos registrados de entrada y salida de los aprendices.</p>
        </div>

        <div className="card-guarda">
          <div className="icono">🔒</div>
          <h3>Seguridad</h3>
          <p>Garantiza que únicamente los vehículos autorizados puedan ingresar al Centro de Formación.</p>
        </div>

      </div>

      <div className="mensaje-final">
        <h2>✅ Recuerda</h2>
        <p>
          Antes de permitir el ingreso o la salida de un vehículo, verifica que el carnet se encuentre activo y que la información coincida con el aprendiz y el vehículo presente.
        </p>
      </div>

    </div>
  );
}
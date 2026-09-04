
import { useEffect, useState } from "react";
import { carnetApi } from "../../api/carnetApi";
import "../../styles/aprendiz/visualizarCarnet.css";

const API_URL = "http://localhost:3000";

/* =====================================================
   CONSTRUIR URL DE IMAGEN
===================================================== */
const construirUrlImagen = (ruta) => {
  if (!ruta) {
    return null;
  }

  let rutaLimpia = String(ruta).trim();

  if (!rutaLimpia) {
    return null;
  }

  // Si ya es una URL completa
  if (
    rutaLimpia.startsWith("http://") ||
    rutaLimpia.startsWith("https://") ||
    rutaLimpia.startsWith("data:")
  ) {
    return rutaLimpia;
  }

  // Cambiar "\" por "/"
  rutaLimpia = rutaLimpia.replace(/\\/g, "/");

  // Quitar "./" inicial
  rutaLimpia = rutaLimpia.replace(/^\.\/+/, "");

  // Quitar "/" inicial
  rutaLimpia = rutaLimpia.replace(/^\/+/, "");

  // Si ya contiene uploads/
  if (rutaLimpia.startsWith("uploads/")) {
    return `${API_URL}/${rutaLimpia}`;
  }

  // Si solamente contiene el nombre/ruta del archivo
  return `${API_URL}/uploads/${rutaLimpia}`;
};

/* =====================================================
   COMPONENTE
===================================================== */
export default function VisualizarCarnet() {
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===================================================
     CARGAR CARNET
  =================================================== */
  const cargarCarnet = async () => {
    try {
      setLoading(true);

      const res = await carnetApi.obtenerMiCarnet();

      console.log("====================================");
      console.log("📋 CARNET RECIBIDO");
      console.log("====================================");

      console.log("Carnet completo:", res.data);

      console.log(
        "📸 Foto aprendiz guardada:",
        res.data?.user?.foto
      );

      console.log(
        "🚗 Foto vehículo guardada:",
        res.data?.vehiculo?.foto_principal
      );

      const fotoAprendizUrl = construirUrlImagen(
        res.data?.user?.foto
      );

      const fotoVehiculoUrl = construirUrlImagen(
        res.data?.vehiculo?.foto_principal
      );

      console.log(
        "🌐 URL foto aprendiz:",
        fotoAprendizUrl
      );

      console.log(
        "🌐 URL foto vehículo:",
        fotoVehiculoUrl
      );

      setCarnet({
        ...res.data,
        _fotoAprendizUrl: fotoAprendizUrl,
        _fotoVehiculoUrl: fotoVehiculoUrl
      });

    } catch (error) {
      console.error(
        "❌ Error al cargar carnet:",
        error
      );

      setCarnet(null);
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     CARGAR AL ENTRAR
  =================================================== */
  useEffect(() => {
    cargarCarnet();
  }, []);

  /* ===================================================
     CARGANDO
  =================================================== */
  if (loading) {
    return (
      <div className="contenedor-carnet">
        <h2>Cargando carnet...</h2>
      </div>
    );
  }

  /* ===================================================
     SIN CARNET
  =================================================== */
  if (!carnet) {
    return (
      <div className="contenedor-carnet">

        <h2>
          No existe un carnet disponible.
        </h2>

        <button
          className="btn-imprimir"
          onClick={cargarCarnet}
        >
          Actualizar
        </button>

      </div>
    );
  }

  /* ===================================================
     DATOS ACTUALES DEL BACKEND
  =================================================== */

  const usuario = carnet.user || {};
  const vehiculo = carnet.vehiculo || {};

  const nombreCompleto =
    `${usuario.nombres || ""} ${usuario.apellidos || ""}`.trim();

  const centroFormacion =
    usuario.centroFormacion?.nombre ||
    usuario.centroFormacion?.nombreCentro ||
    usuario.centroFormacion?.nombre_centro ||
    "No registrado";

  /* ===================================================
     IMÁGENES
  =================================================== */

  const fotoAprendiz =
    carnet._fotoAprendizUrl ||
    construirUrlImagen(usuario.foto);

  const fotoVehiculo =
    carnet._fotoVehiculoUrl ||
    construirUrlImagen(vehiculo.foto_principal);

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="contenedor-carnet">

      <div className="carnet-wrapper">

        {/* =============================================
            ENCABEZADO
        ============================================= */}

        <div className="carnet-header">

          <h2>
            SERVICIO NACIONAL DE APRENDIZAJE
          </h2>

          <h3>
            SENA
          </h3>

        </div>


        {/* =============================================
            IMÁGENES
        ============================================= */}

        <div className="imagenes">

          {/* FOTO APRENDIZ */}

          <div className="foto-aprendiz">

            <h4>
              Aprendiz
            </h4>

            {fotoAprendiz ? (

              <img
                src={fotoAprendiz}
                alt="Aprendiz"
                key={fotoAprendiz}
                onError={(e) => {
                  console.error(
                    "❌ No se pudo cargar la foto del aprendiz:",
                    fotoAprendiz
                  );

                  e.currentTarget.style.display = "none";
                }}
              />

            ) : (

              <p>
                No hay foto
              </p>

            )}

          </div>


          {/* FOTO VEHÍCULO */}

          <div className="foto-vehiculo">

            <h4>
              Vehículo
            </h4>

            {fotoVehiculo ? (

              <img
                src={fotoVehiculo}
                alt="Vehículo"
                key={fotoVehiculo}
                onError={(e) => {
                  console.error(
                    "❌ No se pudo cargar la foto del vehículo:",
                    fotoVehiculo
                  );

                  e.currentTarget.style.display = "none";
                }}
              />

            ) : (

              <p>
                No hay foto
              </p>

            )}

          </div>

        </div>


        {/* =============================================
            INFORMACIÓN DEL APRENDIZ
        ============================================= */}

        <div className="datos">

          <h3>
            Información del Aprendiz
          </h3>

          <p>
            <b>Nombre:</b>{" "}
            {nombreCompleto || "No registrado"}
          </p>

          <p>
            <b>Tipo documento:</b>{" "}
            {usuario.tipoDocumento || "No registrado"}
          </p>

          <p>
            <b>Documento:</b>{" "}
            {usuario.documento || "No registrado"}
          </p>

          <p>
            <b>Correo:</b>{" "}
            {usuario.email || "No registrado"}
          </p>

          <p>
            <b>Celular:</b>{" "}
            {usuario.celular || "No registrado"}
          </p>

          <p>
            <b>Centro de formación:</b>{" "}
            {centroFormacion}
          </p>

          <p>
            <b>Ficha:</b>{" "}
            {usuario.ficha || "No registrada"}
          </p>

          <p>
            <b>Fecha vinculación:</b>{" "}
            {usuario.fechaVinculacion ||
              "No registrada"}
          </p>

          <p>
            <b>Fecha finalización:</b>{" "}
            {usuario.fechaFinalizacion ||
              "No registrada"}
          </p>

          <p>
            <b>Estado:</b>{" "}
            {carnet.estado || "No registrado"}
          </p>


          <hr />


          {/* ===========================================
              INFORMACIÓN DEL VEHÍCULO
          =========================================== */}

          <h3>
            Información del Vehículo
          </h3>

          <p>
            <b>Tipo:</b>{" "}
            {vehiculo.tipo || "No registrado"}
          </p>

          <p>
            <b>Marca:</b>{" "}
            {vehiculo.marca || "No registrada"}
          </p>

          <p>
            <b>Color:</b>{" "}
            {vehiculo.color || "No registrado"}
          </p>


          {/* ===========================================
              BICICLETA
          =========================================== */}

          {vehiculo.tipo?.toLowerCase() ===
          "bicicleta" ? (

            <p>
              <b>Serial:</b>{" "}
              {vehiculo.serial ||
                "No registrado"}
            </p>

          ) : (

            /* =========================================
               MOTO
            ========================================= */

            <>

              <p>
                <b>Placa:</b>{" "}
                {vehiculo.placa ||
                  "No registrada"}
              </p>

              <p>
                <b>Modelo:</b>{" "}
                {vehiculo.modelo ||
                  "No registrado"}
              </p>

              <p>
                <b>Cilindraje:</b>{" "}
                {vehiculo.cilindraje ||
                  "No registrado"}
              </p>

            </>

          )}

        </div>


        {/* =============================================
            QR
        ============================================= */}

        <div className="qr">

          {carnet.qrImage ? (

            <img
              src={carnet.qrImage}
              alt="Código QR del carnet"
            />

          ) : (

            <p>
              No hay código QR
            </p>

          )}

        </div>


        {/* =============================================
            PIE DEL CARNET
        ============================================= */}

        <div className="carnet-footer">

          Carnet válido para ingreso al Centro de Formación

        </div>

      </div>


      {/* ===============================================
          BOTONES
      =============================================== */}

      <div className="botones-carnet">

        <button
          className="btn-imprimir"
          onClick={() => window.print()}
        >
          Imprimir Carnet
        </button>

        <button
          className="btn-actualizar"
          onClick={cargarCarnet}
        >
          Actualizar Carnet
        </button>

      </div>

    </div>
  );
}

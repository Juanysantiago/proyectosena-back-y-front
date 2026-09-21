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

  console.log("Ruta original:", rutaLimpia);

  // Si ya es una URL completa
  if (
    rutaLimpia.startsWith("http://") ||
    rutaLimpia.startsWith("https://") ||
    rutaLimpia.startsWith("data:")
  ) {
    return rutaLimpia;
  }

  // Cambiar \ por /
  rutaLimpia = rutaLimpia.replace(/\\/g, "/");

  // Quitar ./ inicial
  rutaLimpia = rutaLimpia.replace(/^\.\/+/, "");

  // Quitar / inicial
  rutaLimpia = rutaLimpia.replace(/^\/+/, "");

  // Si ya contiene uploads/
  if (rutaLimpia.toLowerCase().startsWith("uploads/")) {
    return `${API_URL}/${rutaLimpia}`;
  }

  // Si contiene public/uploads/
  if (
    rutaLimpia
      .toLowerCase()
      .startsWith("public/uploads/")
  ) {
    return `${API_URL}/${rutaLimpia.replace(
      /^public\//i,
      ""
    )}`;
  }

  // Si contiene uploads/ en alguna parte
  const posicionUploads = rutaLimpia
    .toLowerCase()
    .indexOf("uploads/");

  if (posicionUploads !== -1) {
    rutaLimpia = rutaLimpia.substring(
      posicionUploads
    );

    return `${API_URL}/${rutaLimpia}`;
  }

  // Si solamente viene el nombre del archivo
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

      const res =
        await carnetApi.obtenerMiCarnet();

      console.log("====================================");
      console.log("📋 CARNET RECIBIDO");
      console.log("====================================");

      console.log(
        "Carnet completo:",
        res.data
      );

      console.log(
        "📸 Foto aprendiz recibida:",
        res.data?.user?.foto
      );

      console.log(
        "🚗 Foto vehículo recibida:",
        res.data?.vehiculo?.foto_principal
      );

      const fotoAprendizUrl =
        construirUrlImagen(
          res.data?.user?.foto
        );

      const fotoVehiculoUrl =
        construirUrlImagen(
          res.data?.vehiculo?.foto_principal
        );

      console.log(
        "🌐 URL FOTO APRENDIZ:",
        fotoAprendizUrl
      );

      console.log(
        "🌐 URL FOTO VEHÍCULO:",
        fotoVehiculoUrl
      );

      setCarnet({
        ...res.data,
        _fotoAprendizUrl:
          fotoAprendizUrl,
        _fotoVehiculoUrl:
          fotoVehiculoUrl,
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

        <div className="carnet-wrapper">

          <div className="carnet-header">

            <h2>
              SERVICIO NACIONAL DE APRENDIZAJE
            </h2>

            <h3>SENA</h3>

          </div>

          <div className="datos">

            <h3>
              Cargando carnet...
            </h3>

          </div>

        </div>

      </div>
    );
  }

  /* ===================================================
     SIN CARNET
  =================================================== */

  if (!carnet) {
    return (
      <div className="contenedor-carnet">

        <div className="carnet-wrapper">

          <div className="carnet-header">

            <h2>
              SERVICIO NACIONAL DE APRENDIZAJE
            </h2>

            <h3>SENA</h3>

          </div>

          <div className="datos">

            <h3>
              No existe un carnet disponible.
            </h3>

            <button
              className="btn-imprimir"
              onClick={cargarCarnet}
            >
              Actualizar
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* ===================================================
     DATOS
  =================================================== */

  const usuario =
    carnet.user || {};

  const vehiculo =
    carnet.vehiculo || {};

  const nombreCompleto =
    `${usuario.nombres || ""} ${
      usuario.apellidos || ""
    }`.trim();

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
    construirUrlImagen(
      usuario.foto
    );

  const fotoVehiculo =
    carnet._fotoVehiculoUrl ||
    construirUrlImagen(
      vehiculo.foto_principal ||
      vehiculo.foto
    );

  console.log(
    "🖼️ Foto aprendiz final:",
    fotoAprendiz
  );

  console.log(
    "🖼️ Foto vehículo final:",
    fotoVehiculo
  );

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
                alt="Foto del aprendiz"
                key={fotoAprendiz}

                onLoad={() => {
                  console.log(
                    "✅ Foto del aprendiz cargada:",
                    fotoAprendiz
                  );
                }}

                onError={(e) => {
                  console.error(
                    "❌ Error cargando foto del aprendiz:",
                    fotoAprendiz
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              <p>
                No hay foto del aprendiz
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
                alt="Foto del vehículo"
                key={fotoVehiculo}

                onLoad={() => {
                  console.log(
                    "✅ Foto del vehículo cargada:",
                    fotoVehiculo
                  );
                }}

                onError={(e) => {
                  console.error(
                    "❌ Error cargando foto del vehículo:",
                    fotoVehiculo
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              <p>
                No hay foto del vehículo
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
            {nombreCompleto ||
              "No registrado"}
          </p>

          <p>
            <b>Tipo documento:</b>{" "}
            {usuario.tipoDocumento ||
              "No registrado"}
          </p>

          <p>
            <b>Documento:</b>{" "}
            {usuario.documento ||
              "No registrado"}
          </p>

          <p>
            <b>Correo:</b>{" "}
            {usuario.email ||
              "No registrado"}
          </p>

          <p>
            <b>Celular:</b>{" "}
            {usuario.celular ||
              "No registrado"}
          </p>

          <p>
            <b>Centro de formación:</b>{" "}
            {centroFormacion}
          </p>

          <p>
            <b>Ficha:</b>{" "}
            {usuario.ficha ||
              "No registrada"}
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
            {carnet.estado ||
              "No registrado"}
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
            {vehiculo.tipo ||
              "No registrado"}
          </p>

          <p>
            <b>Marca:</b>{" "}
            {vehiculo.marca ||
              "No registrada"}
          </p>

          <p>
            <b>Color:</b>{" "}
            {vehiculo.color ||
              "No registrado"}
          </p>

          {vehiculo.tipo?.toLowerCase() ===
          "bicicleta" ? (

            <p>
              <b>Serial:</b>{" "}
              {vehiculo.serial ||
                "No registrado"}
            </p>

          ) : (

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
            PIE
        ============================================= */}

        <div className="carnet-footer">

          Carnet válido para ingreso al
          Centro de Formación

        </div>

      </div>

      {/* ===============================================
          BOTONES
      =============================================== */}

      <div className="botones-carnet">

        <button
          className="btn-imprimir"
          onClick={() =>
            window.print()
          }
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
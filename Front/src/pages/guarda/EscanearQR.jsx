
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/guarda/EscanearQR.css";

const API_URL = "http://localhost:3000";

const construirUrlImagen = (ruta) => {
  if (!ruta) return null;

  let rutaLimpia = String(ruta).trim();

  if (!rutaLimpia) return null;

  if (
    rutaLimpia.startsWith("http://") ||
    rutaLimpia.startsWith("https://") ||
    rutaLimpia.startsWith("data:")
  ) {
    return rutaLimpia;
  }

  rutaLimpia = rutaLimpia.replace(/\\/g, "/");
  rutaLimpia = rutaLimpia.replace(/^\.\/+/, "");
  rutaLimpia = rutaLimpia.replace(/^\/+/, "");

  if (rutaLimpia.startsWith("uploads/")) {
    return `${API_URL}/${rutaLimpia}`;
  }

  return `${API_URL}/uploads/${rutaLimpia}`;
};

export default function EscanearQR() {
  const [escaneando, setEscaneando] = useState(false);
  const [carnet, setCarnet] = useState(null);

  const iniciarEscaneo = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      await html5QrCode.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          try {
            await html5QrCode.stop();
          } catch (error) {
            console.error(
              "Error al detener la cámara:",
              error
            );
          }

          setEscaneando(false);

          try {
            console.log(
              "🔎 QR ESCANEADO:",
              decodedText
            );

            const { data } = await axiosClient.post(
              "/api/carnet/escanear",
              {
                codigoQr: decodedText,
              }
            );

            console.log(
              "RESPUESTA DEL SERVIDOR:",
              data
            );

            setCarnet(data);

            alert(
              data.message ||
                `${
                  data.tipo === "entrada"
                    ? "Entrada"
                    : "Salida"
                } registrada correctamente`
            );
          } catch (error) {
            console.error(
              "ERROR AL VALIDAR QR:",
              error
            );

            console.error(
              "RESPUESTA:",
              error.response?.data
            );

            alert(
              error.response?.data?.message ||
                "Error al consultar el carnet"
            );
          }
        },
        () => {}
      );

      setEscaneando(true);
    } catch (error) {
      console.error(
        "ERROR AL ABRIR CÁMARA:",
        error
      );

      alert(
        "No fue posible abrir la cámara"
      );
    }
  };

  useEffect(() => {
    return () => {
      const reader =
        document.getElementById("reader");

      if (reader) {
        reader.innerHTML = "";
      }
    };
  }, []);

  console.log("CARNET:", carnet);

  return (
    <div className="escanear-container">

      <h2 className="titulo-qr">
        ESCANEAR QR
      </h2>

      {!escaneando && (
        <>
          <img
            src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
            alt="Cámara"
            className="camara-imagen"
          />

          <button
            className="btn-escanear"
            onClick={iniciarEscaneo}
          >
            ESCANEAR
          </button>
        </>
      )}

      <div id="reader"></div>

      {carnet && (
        <div className="resultado-qr">

          {/* ========================= */}
          {/* MOVIMIENTO */}
          {/* ========================= */}

          <h3>
            {(carnet.tipo || "registro").toUpperCase()}
          </h3>

          <p>
            <strong>
              Mensaje:
            </strong>{" "}
            {carnet.message ||
              "Registro realizado correctamente"}
          </p>

          {/* ========================= */}
          {/* IMÁGENES */}
          {/* ========================= */}

          <div className="imagenes-qr">

            {carnet.user?.foto && (
              <img
                src={construirUrlImagen(
                  carnet.user.foto
                )}
                alt="Aprendiz"
                className="foto-aprendiz"
                onError={(e) => {
                  console.error(
                    "No se pudo cargar la foto del aprendiz:",
                    e.currentTarget.src
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />
            )}

            {carnet.vehiculo?.foto_principal && (
              <img
                src={construirUrlImagen(
                  carnet.vehiculo.foto_principal
                )}
                alt="Vehículo"
                className="foto-vehiculo"
                onError={(e) => {
                  console.error(
                    "No se pudo cargar la foto del vehículo:",
                    e.currentTarget.src
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />
            )}

          </div>

          {/* ========================= */}
          {/* DATOS DEL APRENDIZ */}
          {/* ========================= */}

          <h4>
            DATOS DEL APRENDIZ
          </h4>

          <p>
            <strong>
              Nombre:
            </strong>{" "}
            {carnet.user?.nombres || ""}
            {" "}
            {carnet.user?.apellidos || ""}
          </p>

          <p>
            <strong>
              Tipo de documento:
            </strong>{" "}
            {carnet.user?.tipoDocumento ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Documento:
            </strong>{" "}
            {carnet.user?.documento ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Ficha:
            </strong>{" "}
            {carnet.user?.ficha ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Correo:
            </strong>{" "}
            {carnet.user?.email ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Celular:
            </strong>{" "}
            {carnet.user?.celular ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Centro:
            </strong>{" "}
            {carnet.user?.centroFormacion?.nombre ||
              "No disponible"}
          </p>

          <p>
            <strong>
              Ciudad:
            </strong>{" "}
            {carnet.user?.centroFormacion?.ciudad ||
              "No disponible"}
          </p>

          {/* ========================= */}
          {/* DATOS DEL VEHÍCULO */}
          {/* ========================= */}

          {carnet.vehiculo && (
            <>
              <h4>
                DATOS DEL VEHÍCULO
              </h4>

              <p>
                <strong>
                  Tipo:
                </strong>{" "}
                {carnet.vehiculo.tipo ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Marca:
                </strong>{" "}
                {carnet.vehiculo.marca ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Color:
                </strong>{" "}
                {carnet.vehiculo.color ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Placa:
                </strong>{" "}
                {carnet.vehiculo.placa ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Serial:
                </strong>{" "}
                {carnet.vehiculo.serial ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Modelo:
                </strong>{" "}
                {carnet.vehiculo.modelo ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Cilindraje:
                </strong>{" "}
                {carnet.vehiculo.cilindraje ||
                  "No disponible"}
              </p>
            </>
          )}

          {/* ========================= */}
          {/* ESTADO DEL REGISTRO */}
          {/* ========================= */}

          <h4>
            REGISTRO DE ACCESO
          </h4>

          <p>
            <strong>
              Movimiento:
            </strong>{" "}
            {(carnet.tipo ||
              "No disponible").toUpperCase()}
          </p>

          <p>
            <strong>
              Estado:
            </strong>{" "}
            {carnet.estado ||
              "No disponible"}
          </p>

          {carnet.registro && (
            <>
              <p>
                <strong>
                  Fecha:
                </strong>{" "}
                {carnet.registro.fecha ||
                  "No disponible"}
              </p>

              <p>
                <strong>
                  Hora de entrada:
                </strong>{" "}
                {carnet.registro.hora_entrada
                  ? new Date(
                      carnet.registro.hora_entrada
                    ).toLocaleString()
                  : "No disponible"}
              </p>

              {carnet.registro.hora_salida && (
                <p>
                  <strong>
                    Hora de salida:
                  </strong>{" "}
                  {new Date(
                    carnet.registro.hora_salida
                  ).toLocaleString()}
                </p>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}

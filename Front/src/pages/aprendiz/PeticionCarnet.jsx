import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import "../../styles/aprendiz/peticionCarnet.css";

export default function PeticionCarnet() {
  const [user, setUser] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const [tipoVehiculo, setTipoVehiculo] = useState("bicicleta");

  const [marca, setMarca] = useState("");
  const [color, setColor] = useState("");
  const [serialPlaca, setSerialPlaca] = useState("");
  const [cilindraje, setCilindraje] = useState("");
  const [modelo, setModelo] = useState("");

  const [fotoAprendiz, setFotoAprendiz] = useState(null);
  const [fotoVehiculo, setFotoVehiculo] = useState(null);
  const [formatoDiligenciado, setFormatoDiligenciado] = useState(null);
  const [documentosAnexos, setDocumentosAnexos] = useState(null);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // CARGAR USUARIO
  // ==========================================

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      setCargandoUsuario(true);

      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      if (!usuarioLocal?.id) {
        console.log(
          "No se encontró el usuario en localStorage"
        );

        setUser(null);
        return;
      }

      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      const usuarioActual = res.data;

      console.log(
        "Usuario actual recibido desde el backend:",
        usuarioActual
      );

      setUser(usuarioActual);

      localStorage.setItem(
        "user",
        JSON.stringify(usuarioActual)
      );
    } catch (error) {
      console.error(
        "Error al cargar los datos del usuario:",
        error
      );

      try {
        const usuarioLocal = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(usuarioLocal);
      } catch {
        setUser(null);
      }
    } finally {
      setCargandoUsuario(false);
    }
  };

  // ==========================================
  // ENVIAR SOLICITUD
  // ==========================================

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "tipoVehiculo",
        tipoVehiculo
      );

      formData.append(
        "marca",
        marca.trim()
      );

      formData.append(
        "color",
        color.trim()
      );

      formData.append(
        "serialPlaca",
        serialPlaca.trim()
      );

      formData.append(
        "cilindraje",
        cilindraje.trim()
      );

      formData.append(
        "modelo",
        modelo.trim()
      );

      formData.append(
        "fotoAprendiz",
        fotoAprendiz
      );

      formData.append(
        "fotoVehiculo",
        fotoVehiculo
      );

      formData.append(
        "formatoDiligenciado",
        formatoDiligenciado
      );

      if (documentosAnexos) {
        formData.append(
          "documentosAnexos",
          documentosAnexos
        );
      }

      await axiosClient.post(
        "/api/solicitudes-carnet",
        formData
      );

      alert(
        "Solicitud enviada correctamente."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Error al enviar la solicitud:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Error al enviar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CARGANDO USUARIO
  // ==========================================

  if (cargandoUsuario) {
    return (
      <div className="peticion-container">
        <div className="peticion-card">
          <div className="peticion-header">
            <h2>
              Cargando información del aprendiz...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // USUARIO NO ENCONTRADO
  // ==========================================

  if (!user) {
    return (
      <div className="peticion-container">
        <div className="peticion-card">
          <div className="peticion-header">
            <h2>
              No se pudo cargar la información del aprendiz.
            </h2>
          </div>

          <button
            type="button"
            className="peticion-button"
            onClick={cargarUsuario}
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FORMULARIO
  // ==========================================

  return (
    <div className="peticion-container">

      <div className="peticion-card">

        {/* =========================
            ENCABEZADO
        ========================= */}

        <div className="peticion-header">
          <h1>Solicitud de Carnet</h1>

          <p>
            Complete la información requerida para
            solicitar su carnet de acceso a SENA Parking.
          </p>
        </div>

        {/* =========================
            FORMULARIO
        ========================= */}

        <form onSubmit={enviarSolicitud}>

          {/* =========================
              DATOS DEL APRENDIZ
          ========================= */}

          <section className="peticion-section">

            <h3>Datos del aprendiz</h3>

            <div className="peticion-fields">

              <div className="peticion-group">
                <label>
                  Documento
                </label>

                <input
                  type="text"
                  value={user.documento || ""}
                  disabled
                />
              </div>

              <div className="peticion-group">
                <label>
                  Nombre completo
                </label>

                <input
                  type="text"
                  value={`${user.nombres || ""} ${user.apellidos || ""}`}
                  disabled
                />
              </div>

              <div className="peticion-group">
                <label>
                  Ficha
                </label>

                <input
                  type="text"
                  value={user.ficha || ""}
                  disabled
                />
              </div>

            </div>

          </section>

          {/* =========================
              INFORMACIÓN VEHÍCULO
          ========================= */}

          <section className="peticion-section">

            <h3>Información del vehículo</h3>

            <div className="peticion-fields">

              <div className="peticion-group">
                <label>
                  Tipo de vehículo
                </label>

                <select
                  value={tipoVehiculo}
                  onChange={(e) =>
                    setTipoVehiculo(e.target.value)
                  }
                >
                  <option value="bicicleta">
                    Bicicleta
                  </option>

                  <option value="moto">
                    Moto
                  </option>
                </select>
              </div>

              <div className="peticion-group">
                <label>
                  Marca
                </label>

                <input
                  type="text"
                  value={marca}
                  onChange={(e) =>
                    setMarca(e.target.value)
                  }
                  required
                />
              </div>

              <div className="peticion-group">
                <label>
                  Color
                </label>

                <input
                  type="text"
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value)
                  }
                  required
                />
              </div>

              {tipoVehiculo === "bicicleta" ? (
                <div className="peticion-group">
                  <label>
                    Serial
                  </label>

                  <input
                    type="text"
                    value={serialPlaca}
                    onChange={(e) =>
                      setSerialPlaca(e.target.value)
                    }
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="peticion-group">
                    <label>
                      Placa
                    </label>

                    <input
                      type="text"
                      value={serialPlaca}
                      onChange={(e) =>
                        setSerialPlaca(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="peticion-group">
                    <label>
                      Cilindraje
                    </label>

                    <input
                      type="text"
                      value={cilindraje}
                      onChange={(e) =>
                        setCilindraje(e.target.value)
                      }
                    />
                  </div>

                  <div className="peticion-group">
                    <label>
                      Modelo
                    </label>

                    <input
                      type="text"
                      value={modelo}
                      onChange={(e) =>
                        setModelo(e.target.value)
                      }
                    />
                  </div>
                </>
              )}

            </div>

          </section>

          {/* =========================
              DOCUMENTOS
          ========================= */}

          <section className="peticion-section">

            <h3>Documentos y archivos</h3>

            <div className="peticion-fields">

              <div className="peticion-group">
                <label>
                  Foto del aprendiz
                </label>

                <input
                  id="fotoAprendiz"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFotoAprendiz(
                      e.target.files[0]
                    )
                  }
                  required
                />
              </div>

              <div className="peticion-group">
                <label>
                  Foto del vehículo
                </label>

                <input
                  id="fotoVehiculo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFotoVehiculo(
                      e.target.files[0]
                    )
                  }
                  required
                />
              </div>

              <div className="peticion-group">
                <label>
                  Formato diligenciado
                </label>

                <input
                  id="formatoDiligenciado"
                  type="file"
                  onChange={(e) =>
                    setFormatoDiligenciado(
                      e.target.files[0]
                    )
                  }
                  required
                />
              </div>

              <div className="peticion-group">
                <label>
                  Documentos anexos
                </label>

                <input
                  id="documentosAnexos"
                  type="file"
                  onChange={(e) =>
                    setDocumentosAnexos(
                      e.target.files[0]
                    )
                  }
                />
              </div>

            </div>

          </section>

          {/* =========================
              BOTÓN
          ========================= */}

          <button
            type="submit"
            className="peticion-button"
            disabled={loading}
          >
            {loading
              ? "Enviando..."
              : "Enviar solicitud"}
          </button>

        </form>

      </div>

    </div>
  );
}
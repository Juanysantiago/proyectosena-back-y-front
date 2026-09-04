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
  // CARGAR USUARIO ACTUAL DESDE EL BACKEND
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

      // Consultamos los datos actuales en la base de datos
      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      const usuarioActual = res.data;

      console.log(
        "Usuario actual recibido desde el backend:",
        usuarioActual
      );

      // Actualizamos el estado
      setUser(usuarioActual);

      // Sincronizamos localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(usuarioActual)
      );

    } catch (error) {

      console.error(
        "Error al cargar los datos del usuario:",
        error
      );

      // Si el backend falla, usamos temporalmente
      // los datos que estaban guardados
      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      setUser(usuarioLocal);

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

        <h2>
          Cargando información del aprendiz...
        </h2>

      </div>
    );

  }


  // ==========================================
  // USUARIO NO ENCONTRADO
  // ==========================================

  if (!user) {

    return (
      <div className="peticion-container">

        <h2>
          No se pudo cargar la información del aprendiz.
        </h2>

        <button
          type="button"
          onClick={cargarUsuario}
        >
          Actualizar
        </button>

      </div>
    );

  }


  // ==========================================
  // FORMULARIO
  // ==========================================

  return (

    <div className="peticion-container">

      <h2>
        Solicitud de Carnet
      </h2>


      <form onSubmit={enviarSolicitud}>


        {/* ============================= */}
        {/* DATOS DEL APRENDIZ */}
        {/* ============================= */}

        <label>
          Documento
        </label>

        <input
          type="text"
          value={user.documento || ""}
          disabled
        />


        <label>
          Nombre Completo
        </label>

        <input
          type="text"
          value={`${user.nombres || ""} ${user.apellidos || ""}`}
          disabled
        />


        <label>
          Ficha
        </label>

        <input
          type="text"
          value={user.ficha || ""}
          disabled
        />


        {/* ============================= */}
        {/* VEHÍCULO */}
        {/* ============================= */}

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


        {/* ============================= */}
        {/* BICICLETA */}
        {/* ============================= */}

        {tipoVehiculo === "bicicleta" ? (

          <>

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

          </>

        ) : (

          /* ============================= */
          /* MOTO */
          /* ============================= */

          <>

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

          </>

        )}


        {/* ============================= */}
        {/* ARCHIVOS */}
        {/* ============================= */}

        <label>
          Foto del aprendiz
        </label>

        <input
          id="fotoAprendiz"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFotoAprendiz(e.target.files[0])
          }
          required
        />


        <label>
          Foto del vehículo
        </label>

        <input
          id="fotoVehiculo"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFotoVehiculo(e.target.files[0])
          }
          required
        />


        <label>
          Formato diligenciado
        </label>

        <input
          id="formatoDiligenciado"
          type="file"
          onChange={(e) =>
            setFormatoDiligenciado(e.target.files[0])
          }
          required
        />


        <label>
          Documentos anexos
        </label>

        <input
          id="documentosAnexos"
          type="file"
          onChange={(e) =>
            setDocumentosAnexos(e.target.files[0])
          }
        />


        {/* ============================= */}
        {/* BOTÓN */}
        {/* ============================= */}

        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Enviando..."
            : "Enviar Solicitud"
          }

        </button>

      </form>

    </div>

  );

}
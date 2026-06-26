import { useEffect, useState } from "react";
import { carnetApi } from "../../api/carnetApi";
import "../../styles/aprendiz/visualizarCarnet.css";

export default function VisualizarCarnet() {
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarCarnet = async () => {
    try {
      setLoading(true);

      const res = await carnetApi.obtenerMiCarnet();

      console.log("Carnet recibido:", res.data);

      setCarnet(res.data || null);
    } catch (error) {
      console.error(error);
      setCarnet(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarnet();

    const interval = setInterval(() => {
      cargarCarnet();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="contenedor-carnet">
        <h2>Cargando carnet...</h2>
      </div>
    );
  }

  if (!carnet) {
    return (
      <div className="contenedor-carnet">
        <h2>No existe un carnet disponible.</h2>

        <button
          className="btn-imprimir"
          onClick={cargarCarnet}
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="contenedor-carnet">

      <div className="carnet-wrapper">

        <div className="carnet-header">
          <h2>SERVICIO NACIONAL DE APRENDIZAJE</h2>
          <h3>SENA</h3>
        </div>

        <div className="imagenes">

          <div className="foto-aprendiz">
            <h4>Aprendiz</h4>

            <img
              src={
                carnet?.fotoAprendiz?.startsWith("http")
                  ? carnet.fotoAprendiz
                  : `http://localhost:3000/uploads/${carnet?.fotoAprendiz}`
              }
              alt="Aprendiz"
            />

          </div>

          <div className="foto-vehiculo">
            <h4>Vehículo</h4>

            <img
              src={
                carnet?.fotoVehiculo?.startsWith("http")
                  ? carnet.fotoVehiculo
                  : `http://localhost:3000/uploads/${carnet?.fotoVehiculo}`
              }
              alt="Vehículo"
            />

          </div>

        </div>

        <div className="datos">

          <h3>Información del Aprendiz</h3>

          <p><b>Nombre:</b> {carnet?.nombre}</p>
          <p><b>Tipo documento:</b> {carnet?.tipoDocumento}</p>
          <p><b>Documento:</b> {carnet?.documento}</p>
          <p><b>Correo:</b> {carnet?.correo}</p>
          <p><b>Celular:</b> {carnet?.celular}</p>
          <p><b>Centro de formación:</b> {carnet?.centroFormacion}</p>
          <p><b>Ficha:</b> {carnet?.ficha}</p>
          <p><b>Fecha vinculación:</b> {carnet?.fechaVinculacion}</p>
          <p><b>Fecha finalización:</b> {carnet?.fechaFinalizacion}</p>
          <p><b>Estado:</b> {carnet?.estado}</p>

          <hr />

          <h3>Información del Vehículo</h3>

          <p><b>Tipo:</b> {carnet?.tipoVehiculo}</p>
          <p><b>Marca:</b> {carnet?.marca}</p>
          <p><b>Color:</b> {carnet?.color}</p>

          {carnet?.tipoVehiculo === "bicicleta" ? (
            <p><b>Serial:</b> {carnet?.serial}</p>
          ) : (
            <>
              <p><b>Placa:</b> {carnet?.placa}</p>
              <p><b>Modelo:</b> {carnet?.modelo}</p>
              <p><b>Cilindraje:</b> {carnet?.cilindraje}</p>
            </>
          )}

        </div>

        <div className="qr">
          {carnet?.qr && (
            <img src={carnet.qr} alt="QR" />
          )}
        </div>

        <div className="carnet-footer">
          Carnet válido para ingreso al Centro de Formación
        </div>

      </div>

      <button
        className="btn-imprimir"
        onClick={() => window.print()}
      >
        Imprimir Carnet
      </button>

      <button onClick={cargarCarnet}>
        Actualizar Carnet
      </button>

    </div>
  );
}
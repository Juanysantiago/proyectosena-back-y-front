const QRCode = require("qrcode");

const Carnet = require("../models/Carnet");
const Vehiculo = require("../models/Vehiculo");
const User = require("../models/User");
const SolicitudCarnet = require("../models/aprendiz/SolicitudCarnet");
const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");

/* =========================
   GENERAR CARNET
========================= */
const generarCarnet = async (req, res) => {
  try {

    const solicitud = await SolicitudCarnet.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message: "La solicitud debe estar aprobada"
      });
    }

    const yaExiste = await Carnet.findOne({
      where: {
        userId: solicitud.userId
      }
    });

    if (yaExiste) {
      return res.status(400).json({
        message: "El carnet ya existe para este usuario"
      });
    }

    const codigoQr = `SENA-${solicitud.userId}-${Date.now()}`;
    const qrImage = await QRCode.toDataURL(codigoQr);

    // ================================
    // GUARDAR FOTO DEL APRENDIZ
    // ================================
    await solicitud.user.update({
      foto: solicitud.fotoAprendiz
    });

    const carnet = await Carnet.create({
      userId: solicitud.userId,
      solicitudId: solicitud.id,
      codigoQr,
      estado: "activo"
    });

    

    /* VEHÍCULO */

    const vehiculoExistente = await Vehiculo.findOne({
      where: {
        userId: solicitud.userId
      }
    });

    if (!vehiculoExistente && solicitud.tipoVehiculo) {

      await Vehiculo.create({

        userId: solicitud.userId,

        tipo: solicitud.tipoVehiculo,

        id_centro_de_formacion: solicitud.user?.ficha || null,

        marca: solicitud.marca,

        color: solicitud.color,

        serial:
          solicitud.tipoVehiculo === "bicicleta"
            ? solicitud.serialPlaca
            : null,

        placa:
          solicitud.tipoVehiculo === "moto"
            ? solicitud.serialPlaca
            : null,

        cilindraje: solicitud.cilindraje,

        modelo: solicitud.modelo,

        foto_principal: solicitud.fotoVehiculo,

        foto_secundaria: solicitud.fotoVehiculo

      });

    }

    solicitud.estado = "carnet_generado";

    await solicitud.save();

    return res.json({

      message: "Carnet generado correctamente",

      carnet,

      qrImage

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      message: "Error generando carnet",

      error: error.message

    });

  }
};
/* =========================
   MI CARNET
========================= */
const obtenerMiCarnet = async (req, res) => {
  try {
    const carnet = await Carnet.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: require("../models/CentroFormacion"),
              as: "centroFormacion"
            }
          ]
        }
      ]
    });

    if (!carnet) {
      return res.status(404).json({
        message: "No tiene carnet generado"
      });
    }

    const vehiculo = await Vehiculo.findOne({
      where: { userId: req.user.id }
    });

    const qrImage = await QRCode.toDataURL(carnet.codigoQr);

    return res.json({
      nombre: `${carnet.user.nombres} ${carnet.user.apellidos}`,
      nombres: carnet.user.nombres,
      apellidos: carnet.user.apellidos,
      tipoDocumento: carnet.user.tipoDocumento,
      documento: carnet.user.documento,
      correo: carnet.user.email,
      celular: carnet.user.celular,
      ficha: carnet.user.ficha,
      centroFormacion: carnet.user.centroFormacion?.nombre || "",
      fechaVinculacion: carnet.user.fechaVinculacion,
      fechaFinalizacion: carnet.user.fechaFinalizacion,

      fotoAprendiz: carnet.user.foto || null,
      fotoVehiculo: vehiculo?.foto_principal || null,

      tipoVehiculo: vehiculo?.tipo || null,
      marca: vehiculo?.marca || null,
      color: vehiculo?.color || null,
      serial: vehiculo?.serial || null,
      placa: vehiculo?.placa || null,
      modelo: vehiculo?.modelo || null,
      cilindraje: vehiculo?.cilindraje || null,

      estado: carnet.estado,
      qr: qrImage
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   ESCANEAR QR
========================= */
const escanearQr = async (req, res) => {
  try {
    const { codigoQr } = req.body;

    const carnet = await Carnet.findOne({
      where: { codigoQr },
      include: [{ model: User, as: "user" }]
    });

    if (!carnet) {
      return res.status(404).json({
        message: "Carnet no encontrado"
      });
    }

    if (carnet.estado !== "activo") {
      return res.status(400).json({
        message: "Carnet inactivo"
      });
    }

    const hoy = new Date().toISOString().split("T")[0];

    let registro = await EntradaSalidaAprendiz.findOne({
      where: {
        id_aprendiz: carnet.userId,
        fecha: hoy,
        hora_salida: null
      }
    });

    let movimiento;

    if (!registro) {
      registro = await EntradaSalidaAprendiz.create({
        id_aprendiz: carnet.userId,
        fecha: hoy,
        hora_entrada: new Date(),
        estado: "dentro"
      });

      movimiento = "entrada";
    } else {
      registro.hora_salida = new Date();
      registro.estado = "fuera";
      await registro.save();

      movimiento = "salida";
    }

    const vehiculo = await Vehiculo.findOne({
      where: { userId: carnet.userId }
    });

    const qrImage = await QRCode.toDataURL(carnet.codigoQr);

    return res.json({
      movimiento,
      registro,
      carnet: {
        nombre: `${carnet.user.nombres} ${carnet.user.apellidos}`,
        documento: carnet.user.documento,
        ficha: carnet.user.ficha,
        correo: carnet.user.email,
        celular: carnet.user.celular,
        centroFormacion: carnet.user.centroFormacion?.nombre || "",

        fotoAprendiz: carnet.user.foto || null,
        fotoVehiculo: vehiculo?.foto_principal || null,

        tipoVehiculo: vehiculo?.tipo || null,
        marca: vehiculo?.marca || null,
        color: vehiculo?.color || null,
        placa: vehiculo?.placa || null,
        serial: vehiculo?.serial || null,

        qr: qrImage
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   PENDIENTES (si aplica)
========================= */
const obtenerCarnetsPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudCarnet.findAll({
      where: { estado: "aprobada" },
      include: [{ model: User, as: "user" }]
    });

    return res.json(solicitudes);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  generarCarnet,
  obtenerCarnetsPendientes,
  obtenerMiCarnet,
  escanearQr
};
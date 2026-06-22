const QRCode = require("qrcode");

const Carnet = require("../models/Carnet");
const Vehiculo = require("../models/Vehiculo");
const User = require("../models/User");
const SolicitudCarnet = require("../models/aprendiz/SolicitudCarnet");

const generarCarnet = async (req, res) => {
  try {
    const solicitud = await SolicitudCarnet.findByPk(req.params.id, {
      include: [{ model: User, as: "user" }]
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message: "La solicitud debe estar aprobada"
      });
    }

    const existe = await Carnet.findOne({
      where: { solicitudId: solicitud.id }
    });

    if (existe) {
      return res.status(400).json({
        message: "El carnet ya fue generado"
      });
    }

    const codigoQr = `SENA-${solicitud.userId}-${Date.now()}`;

    const qrImage = await QRCode.toDataURL(codigoQr);

    const carnet = await Carnet.create({
      userId: solicitud.userId,
      solicitudId: solicitud.id,
      codigoQr
    });

    await Vehiculo.create({
      userId: solicitud.userId,
      tipo: solicitud.tipoVehiculo,
      id_centro_de_formacion: solicitud.user?.ficha ?? null,
      marca: solicitud.marca,
      color: solicitud.color,
      serial: solicitud.tipoVehiculo === "bicicleta" ? solicitud.serialPlaca : null,
      placa: solicitud.tipoVehiculo === "moto" ? solicitud.serialPlaca : null,
      cilindraje: solicitud.cilindraje,
      modelo: solicitud.modelo,
      foto_principal: solicitud.fotoVehiculo,
      foto_secundaria: solicitud.fotoVehiculo
    });

    solicitud.estado = "carnet_generado";
    await solicitud.save();

    return res.json({
      message: "Carnet generado correctamente",
      carnet,
      qrImage
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error generando carnet",
      error: error.message
    });
  }
};

const obtenerCarnetsPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudCarnet.findAll({
      where: { estado: "aprobada" },
      include: [{ model: User, as: "user" }]
    });

    return res.json(solicitudes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtenerMiCarnet = async (req, res) => {
  try {
    const carnet = await Carnet.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: "user" }]
    });

    if (!carnet) {
      return res.status(404).json({ message: "Aún no tiene carnet" });
    }

    const solicitud = await SolicitudCarnet.findByPk(carnet.solicitudId);

    const qrImage = await QRCode.toDataURL(carnet.codigoQr);

    return res.json({ carnet, solicitud, qrImage });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generarCarnet,
  obtenerCarnetsPendientes,
  obtenerMiCarnet
};
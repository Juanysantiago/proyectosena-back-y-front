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

    const solicitud = await SolicitudCarnet.findByPk(carnet.solicitudId);

    const vehiculo = await Vehiculo.findOne({
      where: {
        userId: req.user.id
      }
    });

    const qrImage = await QRCode.toDataURL(carnet.codigoQr);

    return res.json({
      // DATOS DEL APRENDIZ
      nombre: `${carnet.user.nombres} ${carnet.user.apellidos}`,
      nombres: carnet.user.nombres,
      apellidos: carnet.user.apellidos,
      tipoDocumento: carnet.user.tipoDocumento,
      documento: carnet.user.documento,
      correo: carnet.user.email,
      celular: carnet.user.celular,
      ficha: carnet.user.ficha,
      centroFormacion:
        carnet.user.centroFormacion?.nombre || "",
      fechaVinculacion: carnet.user.fechaVinculacion,
      fechaFinalizacion: carnet.user.fechaFinalizacion,

      // FOTOS
      fotoAprendiz: solicitud.fotoAprendiz,
      fotoVehiculo: solicitud.fotoVehiculo,

      // VEHÍCULO
      tipoVehiculo: vehiculo?.tipo,
      marca: vehiculo?.marca,
      color: vehiculo?.color,
      serial: vehiculo?.serial,
      placa: vehiculo?.placa,
      modelo: vehiculo?.modelo,
      cilindraje: vehiculo?.cilindraje,

      // CARNET
      estado: carnet.estado,
      qr: qrImage
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
  generarCarnet,
  obtenerCarnetsPendientes,
  obtenerMiCarnet
};
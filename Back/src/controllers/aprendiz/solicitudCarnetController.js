const SolicitudCarnet = require("../../models/aprendiz/SolicitudCarnet.js");
const User = require("../../models/User");

const crearSolicitud = async (req, res) => {
  try {

    const solicitud = await SolicitudCarnet.create({
      userId: req.user.id,
      serialPlaca: req.body.serialPlaca,

      fotoAprendiz:
        req.files.fotoAprendiz[0].filename,

      fotoVehiculo:
        req.files.fotoVehiculo[0].filename,

      formatoDiligenciado:
        req.files.formatoDiligenciado[0].filename,

     documentosAnexos:
  req.files.documentosAnexos
    ? req.files.documentosAnexos[0].filename
    : null
    });

    res.status(201).json(solicitud);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const listarSolicitudes = async (req, res) => {

  const solicitudes =
    await SolicitudCarnet.findAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "documento",
            "nombres",
            "apellidos"
          ]
        }
      ]
    });

  res.json(solicitudes);
};

const aprobarSolicitud = async (req, res) => {

  const solicitud =
    await SolicitudCarnet.findByPk(
      req.params.id
    );

  if (!solicitud) {
    return res.status(404).json({
      message: "Solicitud no encontrada"
    });
  }

  solicitud.estado = "aprobada";

  await solicitud.save();

  res.json(solicitud);
};

const rechazarSolicitud = async (req, res) => {

  const solicitud =
    await SolicitudCarnet.findByPk(
      req.params.id
    );

  if (!solicitud) {
    return res.status(404).json({
      message: "Solicitud no encontrada"
    });
  }

  solicitud.estado = "rechazada";

  await solicitud.save();

  res.json(solicitud);
};

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
};
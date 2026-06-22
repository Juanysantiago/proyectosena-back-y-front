const SolicitudCarnet = require("../../models/aprendiz/SolicitudCarnet");
const User = require("../../models/User");

const crearSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudCarnet.create({
      userId: req.user.id,

      tipoVehiculo: req.body.tipoVehiculo,
      marca: req.body.marca,
      color: req.body.color,
      serialPlaca: req.body.serialPlaca,
      cilindraje: req.body.cilindraje || null,
      modelo: req.body.modelo || null,

      fotoAprendiz: req.files.fotoAprendiz[0].filename,
      fotoVehiculo: req.files.fotoVehiculo[0].filename,
      formatoDiligenciado: req.files.formatoDiligenciado[0].filename,

      documentosAnexos: req.files.documentosAnexos
        ? req.files.documentosAnexos[0].filename
        : null,

      estado: "pendiente"
    });

    res.status(201).json(solicitud);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const listarSolicitudes = async (req, res) => {
  try {

    const solicitudes = await SolicitudCarnet.findAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "documento",
            "nombres",
            "apellidos",
            "ficha"
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(solicitudes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const aprobarSolicitud = async (req, res) => {

  const solicitud = await SolicitudCarnet.findByPk(req.params.id);

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

  const solicitud = await SolicitudCarnet.findByPk(req.params.id);

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
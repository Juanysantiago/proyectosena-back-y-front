const User = require("../../models/User");
const SolicitudCarnet = require("../../models/aprendiz/SolicitudCarnet");

const crearSolicitud = async (req, res) => {
  try {
    if (
      !req.files ||
      !req.files.fotoAprendiz ||
      !req.files.fotoVehiculo ||
      !req.files.formatoDiligenciado
    ) {
      return res.status(400).json({
        message: "Faltan archivos obligatorios"
      });
    }

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

    return res.status(201).json(solicitud);

  } catch (error) {
    console.error("ERROR CREAR SOLICITUD:", error);

    return res.status(500).json({
      message: "Error al crear la solicitud",
      error: error.message
    });
  }
};

const listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudCarnet.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "documento", "nombres", "apellidos", "ficha"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json(solicitudes);
  } catch (error) {
    console.error("ERROR LISTAR SOLICITUDES:", error);

    return res.status(500).json({
      message: "Error al listar solicitudes",
      error: error.message
    });
  }
};

const aprobarSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudCarnet.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    solicitud.estado = "aprobada";
    await solicitud.save();

    return res.json(solicitud);
  } catch (error) {
    return res.status(500).json({
      message: "Error al aprobar solicitud",
      error: error.message
    });
  }
};

const rechazarSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudCarnet.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    solicitud.estado = "rechazada";
    await solicitud.save();

    return res.json(solicitud);
  } catch (error) {
    return res.status(500).json({
      message: "Error al rechazar solicitud",
      error: error.message
    });
  }
};

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
};
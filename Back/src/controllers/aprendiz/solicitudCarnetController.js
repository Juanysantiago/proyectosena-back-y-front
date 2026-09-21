const User = require("../../models/User");
const SolicitudCarnet = require("../../models/aprendiz/SolicitudCarnet");

// ==========================================
// CREAR SOLICITUD
// ==========================================

const crearSolicitud = async (req, res) => {
  try {

    console.log("");
    console.log("📥 NUEVA SOLICITUD DE CARNET");
    console.log("================================");

    console.log("👤 USER:", req.user);

    console.log("📦 BODY:", req.body);

    console.log(
      "📁 FILES:",
      req.files
        ? Object.keys(req.files)
        : "undefined"
    );

    // ==========================================
    // VALIDAR ARCHIVOS PRINCIPALES
    // ==========================================

    if (
      !req.files ||
      !req.files.fotoAprendiz ||
      !req.files.fotoVehiculo ||
      !req.files.fotoCedula ||
      !req.files.tarjetaPropiedad
    ) {

      return res.status(400).json({
        message:
          "Faltan archivos obligatorios: foto del aprendiz, foto del vehículo, cédula o tarjeta de propiedad."
      });
    }

    // ==========================================
    // DATOS
    // ==========================================

    const tipoVehiculo =
      req.body.tipoVehiculo;

    const marca =
      req.body.marca;

    const color =
      req.body.color;

    const serialPlaca =
      req.body.serialPlaca;

    const cilindraje =
      req.body.cilindraje || null;

    const modelo =
      req.body.modelo || null;

    // ==========================================
    // VALIDAR FOTO SERIAL / PLACA
    // ==========================================

    if (
      !req.files.fotoPlacaSerial
    ) {

      return res.status(400).json({
        message:
          tipoVehiculo === "bicicleta"
            ? "Falta la foto del serial de la bicicleta."
            : "Falta la foto de la placa de la moto."
      });
    }

    // ==========================================
    // VALIDAR DOCUMENTOS DE MOTO
    // ==========================================

    if (tipoVehiculo === "moto") {

      if (!req.files.soat) {

        return res.status(400).json({
          message:
            "Falta el SOAT de la moto."
        });
      }

      if (!req.files.tecnomecanica) {

        return res.status(400).json({
          message:
            "Falta la tecnomecánica de la moto."
        });
      }

      if (!cilindraje) {

        return res.status(400).json({
          message:
            "El cilindraje es obligatorio para una moto."
        });
      }

      if (!modelo) {

        return res.status(400).json({
          message:
            "El modelo es obligatorio para una moto."
        });
      }
    }

    // ==========================================
    // CREAR SOLICITUD
    // ==========================================

    const solicitud =
      await SolicitudCarnet.create({

        userId: req.user.id,

        tipoVehiculo,

        marca,

        color,

        serialPlaca,

        cilindraje,

        modelo,

        // ==========================
        // FOTOS
        // ==========================

        fotoAprendiz:
          req.files.fotoAprendiz[0].filename,

        fotoVehiculo:
          req.files.fotoVehiculo[0].filename,

        // ==========================
        // DOCUMENTOS
        // ==========================

        fotoCedula:
          req.files.fotoCedula[0].filename,

        tarjetaPropiedad:
          req.files.tarjetaPropiedad[0].filename,

        // ==========================
        // SERIAL / PLACA
        // ==========================

        fotoPlacaSerial:
          req.files.fotoPlacaSerial[0].filename,

        // ==========================
        // MOTO
        // ==========================

        soat:
          req.files.soat
            ? req.files.soat[0].filename
            : null,

        tecnomecanica:
          req.files.tecnomecanica
            ? req.files.tecnomecanica[0].filename
            : null,

        // ==========================
        // ESTADO
        // ==========================

        estado: "pendiente",
      });

    console.log(
      "✅ SOLICITUD CREADA:",
      solicitud.id
    );

    console.log(
      "================================"
    );

    return res.status(201).json({
      message:
        "Solicitud creada correctamente.",
      solicitud,
    });

  } catch (error) {

    console.error(
      "❌ ERROR CREAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al crear la solicitud.",
      error: error.message,
    });
  }
};

// ==========================================
// LISTAR SOLICITUDES
// ==========================================

const listarSolicitudes = async (req, res) => {

  try {

    const solicitudes =
      await SolicitudCarnet.findAll({

        include: [
          {
            model: User,

            as: "user",

            attributes: [
              "id",
              "documento",
              "nombres",
              "apellidos",
              "ficha",
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"]
        ],
      });

    return res.json(
      solicitudes
    );

  } catch (error) {

    console.error(
      "ERROR LISTAR SOLICITUDES:",
      error
    );

    return res.status(500).json({
      message:
        "Error al listar solicitudes.",
      error: error.message,
    });
  }
};

// ==========================================
// APROBAR
// ==========================================

const aprobarSolicitud = async (
  req,
  res
) => {

  try {

    const solicitud =
      await SolicitudCarnet.findByPk(
        req.params.id
      );

    if (!solicitud) {

      return res.status(404).json({
        message:
          "Solicitud no encontrada",
      });
    }

    solicitud.estado =
      "aprobada";

    await solicitud.save();

    return res.json(
      solicitud
    );

  } catch (error) {

    console.error(
      "ERROR APROBAR:",
      error
    );

    return res.status(500).json({
      message:
        "Error al aprobar solicitud",
      error: error.message,
    });
  }
};

// ==========================================
// RECHAZAR
// ==========================================

const rechazarSolicitud = async (
  req,
  res
) => {

  try {

    const solicitud =
      await SolicitudCarnet.findByPk(
        req.params.id
      );

    if (!solicitud) {

      return res.status(404).json({
        message:
          "Solicitud no encontrada",
      });
    }

    solicitud.estado =
      "rechazada";

    await solicitud.save();

    return res.json(
      solicitud
    );

  } catch (error) {

    console.error(
      "ERROR RECHAZAR:",
      error
    );

    return res.status(500).json({
      message:
        "Error al rechazar solicitud",
      error: error.message,
    });
  }
};

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};
const SolicitudActualizacion = require("../../models/aprendiz/SolicitudActualizacion");
const User = require("../../models/User");
const Vehiculo = require("../../models/Vehiculo");
const Notificacion = require("../../models/Notificacion");
const generarOCrearCarnet = require("../../utils/generarOCrearCarnet");

/* =========================
   CREAR SOLICITUD
========================= */
const crearSolicitud = async (req, res) => {
  try {
    let { tipo, datosActuales, datosNuevos } = req.body;

    if (typeof datosActuales === "string") {
      datosActuales = JSON.parse(datosActuales);
    }

    if (typeof datosNuevos === "string") {
      datosNuevos = JSON.parse(datosNuevos);
    }

    const solicitud = await SolicitudActualizacion.create({
      userId: req.user.id,
      tipo,
      datosActuales,
      datosNuevos,
      fotoNueva: req.files?.fotoNueva?.[0]?.path || null,
      documentos: req.files?.documentos?.map(f => ({
        nombre: f.originalname,
        ruta: f.path
      })) || [],
      estado: "pendiente"
    });

    return res.status(201).json({
      message: "Solicitud enviada correctamente",
      solicitud
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   LISTAR SOLICITUDES
========================= */
const listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudActualizacion.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nombres", "apellidos", "documento", "ficha"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json(solicitudes);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   APROBAR SOLICITUD (FLUJO FINAL)
========================= */
const aprobarSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudActualizacion.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    let usuarioActualizado = null;

    /* =========================
       USUARIO
    ========================= */
    if (solicitud.tipo === "datos_personales") {
      const datosUsuario = {
        nombres: solicitud.datosNuevos?.nombres,
        apellidos: solicitud.datosNuevos?.apellidos,
        celular: solicitud.datosNuevos?.celular,
        ficha: solicitud.datosNuevos?.ficha
      };

      if (solicitud.fotoNueva) {
        datosUsuario.foto = solicitud.fotoNueva;
      }

      await User.update(datosUsuario, {
        where: { id: solicitud.userId }
      });

      usuarioActualizado = await User.findByPk(solicitud.userId);
    }

    /* =========================
       VEHÍCULO
    ========================= */
    if (solicitud.tipo === "vehiculo") {
      const data = solicitud.datosNuevos;

      const datosVehiculo = {
        tipo: data.tipoVehiculo,
        marca: data.marca,
        color: data.color,
        cilindraje: data.cilindraje,
        modelo: data.modelo
      };

      if (data.tipoVehiculo === "bicicleta") {
        datosVehiculo.serial = data.serialPlaca;
        datosVehiculo.placa = null;
      }

      if (data.tipoVehiculo === "moto") {
        datosVehiculo.placa = data.serialPlaca;
        datosVehiculo.serial = null;
      }

      if (solicitud.fotoNueva) {
        datosVehiculo.foto_principal = solicitud.fotoNueva;
      }

      await Vehiculo.update(datosVehiculo, {
        where: { userId: solicitud.userId }
      });
    }

    /* =========================
       MARCAR SOLICITUD
    ========================= */
    await solicitud.update({ estado: "aprobada" });

    /* =========================
       🔥 REGENERAR CARNET (CRÍTICO)
    ========================= */
    const { carnet, qrImage } = await generarOCrearCarnet(
      solicitud.userId,
      solicitud.id
    );

    /* =========================
       NOTIFICACIÓN
    ========================= */
    await Notificacion.create({
      userId: solicitud.userId,
      mensaje: "Datos actualizados y carnet regenerado correctamente."
    });

    return res.json({
      message: "OK",
      usuarioActualizado,
      carnet,
      qrImage
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  aprobarSolicitud
};

/* =========================
   RECHAZAR SOLICITUD
========================= */
const rechazarSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudActualizacion.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    solicitud.estado = "rechazada";
    await solicitud.save();

    await Notificacion.create({
      userId: solicitud.userId,
      mensaje: "Tu solicitud fue rechazada."
    });

    return res.json({
      message: "Solicitud rechazada"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
};
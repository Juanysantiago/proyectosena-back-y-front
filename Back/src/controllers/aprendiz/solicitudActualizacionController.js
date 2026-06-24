const SolicitudActualizacion = require("../../models/aprendiz/SolicitudActualizacion");
const User = require("../../models/User");
const Vehiculo = require("../../models/Vehiculo");
const Notificacion = require("../../models/Notificacion");

const crearSolicitud = async (req, res) => {
  try {
    let { tipo, datosActuales, datosNuevos } =
      req.body;

    if (typeof datosActuales === "string") {
      datosActuales =
        JSON.parse(datosActuales);
    }

    if (typeof datosNuevos === "string") {
      datosNuevos =
        JSON.parse(datosNuevos);
    }

    const solicitud =
      await SolicitudActualizacion.create({
        userId: req.user.id,
        tipo,
        datosActuales,
        datosNuevos,
        fotoNueva:
          req.file?.path || null,
        estado: "pendiente"
      });

    return res.status(201).json({
      message:
        "Solicitud enviada correctamente",
      solicitud
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });

  }
};

const listarSolicitudes = async (req, res) => {
  try {

    const solicitudes =
      await SolicitudActualizacion.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "nombres",
              "apellidos",
              "documento",
              "ficha"
            ]
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

const aprobarSolicitud = async (req, res) => {
  try {

    const solicitud =
      await SolicitudActualizacion.findByPk(
        req.params.id
      );

      await Notificacion.create({
  userId: solicitud.userId,
  mensaje:
    "Tu solicitud de actualización de datos ha sido aprobada con éxito."
});

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    if (
      solicitud.tipo ===
      "datos_personales"
    ) {

      await User.update(
        solicitud.datosNuevos,
        {
          where: {
            id: solicitud.userId
          }
        }

        
      );

    } else {

      const datosVehiculo = {
        tipo:
          solicitud.datosNuevos.tipoVehiculo,
        marca:
          solicitud.datosNuevos.marca,
        color:
          solicitud.datosNuevos.color,
        cilindraje:
          solicitud.datosNuevos.cilindraje,
        modelo:
          solicitud.datosNuevos.modelo
      };

      if (solicitud.fotoNueva) {
  datosVehiculo.foto_principal =
    solicitud.fotoNueva;
}

      if (
        solicitud.datosNuevos.tipoVehiculo ===
        "bicicleta"
      ) {
        datosVehiculo.serial =
          solicitud.datosNuevos.serialPlaca;

        datosVehiculo.placa = null;
      }

      if (
        solicitud.datosNuevos.tipoVehiculo ===
        "moto"
      ) {
        datosVehiculo.placa =
          solicitud.datosNuevos.serialPlaca;

        datosVehiculo.serial = null;
      }

      await Vehiculo.update(
        datosVehiculo,
        {
          where: {
            userId: solicitud.userId
          }
        }
      );
    }

    solicitud.estado = "aprobada";

    await solicitud.save();

    await Notificacion.create({
  userId: solicitud.userId,
  mensaje:
    "Tu solicitud de actualización de datos ha sido aprobada con éxito."
});

    return res.json({
      message:
        "Solicitud aprobada correctamente"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });

  }
};

const rechazarSolicitud = async (req, res) => {
  try {

    const solicitud =
      await SolicitudActualizacion.findByPk(
        req.params.id
      );

      await Notificacion.create({
  userId: solicitud.userId,
  mensaje:
    "Tu solicitud de actualización de datos ha sido rechazada. Vuelve a intentarlo."
});

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    solicitud.estado = "rechazada";

    await solicitud.save();

    await Notificacion.create({
  userId: solicitud.userId,
  mensaje:
    "Tu solicitud de actualización de datos ha sido rechazada. Vuelve a intentarlo."
});

    return res.json({
      message:
        "Solicitud rechazada"
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
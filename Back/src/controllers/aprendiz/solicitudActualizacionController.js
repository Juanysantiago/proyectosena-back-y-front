const SolicitudActualizacion = require("../../models/aprendiz/SolicitudActualizacion");
const User = require("../../models/User");
const Vehiculo = require("../../models/Vehiculo");
const Notificacion = require("../../models/Notificacion");
const generarOCrearCarnet = require("../../utils/generarOCrearCarnet");
const sequelize = require("../../config/database");

/* =========================================================
   NORMALIZAR RUTA DE ARCHIVO
========================================================= */

const normalizarRuta = (ruta) => {
  if (!ruta) {
    return null;
  }

  return String(ruta)
    .replace(/\\/g, "/")
    .replace(/^.*?uploads\//, "uploads/");
};

/* =========================================================
   CREAR SOLICITUD
========================================================= */

const crearSolicitud = async (req, res) => {
  try {
    let {
      tipo,
      datosActuales,
      datosNuevos
    } = req.body;

    /* =====================================================
       VALIDAR TIPO
    ===================================================== */

    if (
      tipo !== "datos_personales" &&
      tipo !== "datos_vehiculo"
    ) {
      return res.status(400).json({
        message:
          "El tipo de actualización no es válido"
      });
    }

    /* =====================================================
       CONVERTIR JSON
    ===================================================== */

    if (typeof datosActuales === "string") {
      try {
        datosActuales =
          JSON.parse(datosActuales);
      } catch (error) {
        return res.status(400).json({
          message:
            "Los datos actuales no tienen un formato válido"
        });
      }
    }

    if (typeof datosNuevos === "string") {
      try {
        datosNuevos =
          JSON.parse(datosNuevos);
      } catch (error) {
        return res.status(400).json({
          message:
            "Los datos nuevos no tienen un formato válido"
        });
      }
    }

    /* =====================================================
       VALIDAR DATOS
    ===================================================== */

    if (
      !datosActuales ||
      typeof datosActuales !== "object"
    ) {
      datosActuales = {};
    }

    if (
      !datosNuevos ||
      typeof datosNuevos !== "object"
    ) {
      return res.status(400).json({
        message:
          "Los datos nuevos son obligatorios"
      });
    }

    /* =====================================================
       BUSCAR USUARIO
    ===================================================== */

    const usuario =
      await User.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }

    /* =====================================================
       FOTO
    ===================================================== */

    const archivoFoto =
      req.files?.fotoNueva?.[0] || null;

    const fotoNueva =
      archivoFoto
        ? normalizarRuta(archivoFoto.path)
        : null;

    /* =====================================================
       DOCUMENTOS
    ===================================================== */

    const documentos =
      req.files?.documentos?.map(
        (archivo) => ({
          nombre:
            archivo.originalname,

          ruta:
            normalizarRuta(
              archivo.path
            )
        })
      ) || [];

    /* =====================================================
       CREAR SOLICITUD
    ===================================================== */

    const solicitud =
      await SolicitudActualizacion.create({
        userId: req.user.id,
        tipo,
        datosActuales,
        datosNuevos,
        fotoNueva,
        documentos,
        estado: "pendiente"
      });

    return res.status(201).json({
      message:
        "Solicitud enviada correctamente",

      solicitud
    });

  } catch (error) {
    console.error(
      "❌ ERROR CREAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al crear la solicitud",

      error:
        error.message
    });
  }
};

/* =========================================================
   LISTAR SOLICITUDES
========================================================= */

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

        order: [
          ["createdAt", "DESC"]
        ]
      });

    return res.status(200).json(
      solicitudes
    );

  } catch (error) {
    console.error(
      "❌ ERROR LISTAR SOLICITUDES:",
      error
    );

    return res.status(500).json({
      message:
        "Error al listar las solicitudes",

      error:
        error.message
    });
  }
};

/* =========================================================
   APROBAR SOLICITUD
========================================================= */

const aprobarSolicitud = async (req, res) => {
  let transaction;

  try {
    console.log("");
    console.log(
      "=============================================="
    );
    console.log(
      "🟢 INICIO APROBACIÓN"
    );
    console.log(
      "=============================================="
    );

    /* =====================================================
       VALIDAR ID
    ===================================================== */

    const solicitudId =
      Number(req.params.id);

    console.log(
      "🟢 ID SOLICITUD:",
      solicitudId
    );

    if (
      !Number.isInteger(solicitudId) ||
      solicitudId <= 0
    ) {
      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido"
      });
    }

    /* =====================================================
       CREAR TRANSACCIÓN
    ===================================================== */

    transaction =
      await sequelize.transaction();

    console.log(
      "🟢 TRANSACCIÓN INICIADA"
    );

    /* =====================================================
       BUSCAR SOLICITUD
    ===================================================== */

    const solicitud =
      await SolicitudActualizacion.findByPk(
        solicitudId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!solicitud) {
      await transaction.rollback();

      return res.status(404).json({
        message:
          "Solicitud no encontrada"
      });
    }

    console.log(
      "🟢 SOLICITUD ENCONTRADA:"
    );

    console.log(
      solicitud.toJSON()
    );

    /* =====================================================
       VALIDAR ESTADO
    ===================================================== */

    if (
      solicitud.estado !== "pendiente"
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          `La solicitud ya fue ${solicitud.estado}`
      });
    }

    /* =====================================================
       BUSCAR USUARIO
    ===================================================== */

    const usuario =
      await User.findByPk(
        solicitud.userId,
        {
          transaction
        }
      );

    if (!usuario) {
      await transaction.rollback();

      return res.status(404).json({
        message:
          "El usuario asociado a la solicitud no existe"
      });
    }

    console.log(
      "🟢 USUARIO ENCONTRADO:"
    );

    console.log(
      usuario.toJSON()
    );

    /* =====================================================
       LEER DATOS NUEVOS
    ===================================================== */

    let datos =
      solicitud.datosNuevos || {};

    if (typeof datos === "string") {
      try {
        datos =
          JSON.parse(datos);
      } catch (error) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "Los datos nuevos tienen un formato inválido"
        });
      }
    }

    console.log(
      "🟡 DATOS NUEVOS:"
    );

    console.log(
      datos
    );

    let usuarioActualizado = null;
    let vehiculoActualizado = null;

    /* =====================================================
       DATOS PERSONALES
    ===================================================== */

    if (
      solicitud.tipo ===
      "datos_personales"
    ) {
      console.log(
        "🟦 ACTUALIZANDO DATOS PERSONALES"
      );

      const datosUsuario = {};

      const camposPermitidos = [
        "nombres",
        "apellidos",
        "documento",
        "tipoDocumento",
        "celular",
        "ficha",
        "centroFormacionId",
        "fechaVinculacion",
        "fechaFinalizacion"
      ];

      camposPermitidos.forEach(
        (campo) => {
          if (
            datos[campo] !== undefined &&
            datos[campo] !== null &&
            datos[campo] !== ""
          ) {
            datosUsuario[campo] =
              datos[campo];
          }
        }
      );

      /* ===================================================
         FOTO
      =================================================== */

      if (solicitud.fotoNueva) {
        datosUsuario.foto =
          normalizarRuta(
            solicitud.fotoNueva
          );
      }

      console.log(
        "🟡 DATOS QUE SE GUARDARÁN EN USERS:"
      );

      console.log(
        datosUsuario
      );

      /* ===================================================
         VALIDAR QUE HAYA DATOS
      =================================================== */

      if (
        Object.keys(datosUsuario)
          .length === 0
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "No existen datos válidos para actualizar"
        });
      }

      /* ===================================================
         UPDATE EXPLÍCITO DEL USUARIO
      =================================================== */

      console.log(
        "🟡 EJECUTANDO UPDATE Users..."
      );

      const [filasActualizadas] =
        await User.update(
          datosUsuario,
          {
            where: {
              id: solicitud.userId
            },

            transaction
          }
        );

      console.log(
        "🟢 FILAS USERS ACTUALIZADAS:",
        filasActualizadas
      );

      /* ===================================================
         COMPROBAR UPDATE
      =================================================== */

      if (
        filasActualizadas !== 1
      ) {
        console.error(
          "❌ USERS NO FUE ACTUALIZADO"
        );

        await transaction.rollback();

        return res.status(400).json({
          message:
            "La base de datos no actualizó el usuario"
        });
      }

      /* ===================================================
         RECARGAR USUARIO
      =================================================== */

      usuarioActualizado =
        await User.findByPk(
          solicitud.userId,
          {
            transaction
          }
        );

      console.log(
        "✅ USUARIO DESPUÉS DEL UPDATE:"
      );

      console.log(
        usuarioActualizado.toJSON()
      );
    }

    /* =====================================================
       DATOS VEHÍCULO
    ===================================================== */

    if (
      solicitud.tipo ===
      "datos_vehiculo"
    ) {
      console.log(
        "🟩 ACTUALIZANDO VEHÍCULO"
      );

      /* ===================================================
         VALIDAR TIPO
      =================================================== */

      if (
        datos.tipoVehiculo !==
          "bicicleta" &&
        datos.tipoVehiculo !==
          "moto"
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "El tipo de vehículo no es válido"
        });
      }

      /* ===================================================
         BUSCAR VEHÍCULO
      =================================================== */

      const vehiculo =
        await Vehiculo.findOne({
          where: {
            userId:
              solicitud.userId
          },

          transaction
        });

      if (!vehiculo) {
        await transaction.rollback();

        return res.status(404).json({
          message:
            "El usuario no tiene un vehículo registrado"
        });
      }

      console.log(
        "🟢 VEHÍCULO ACTUAL:"
      );

      console.log(
        vehiculo.toJSON()
      );

      /* ===================================================
         DATOS DEL VEHÍCULO
      =================================================== */

      const datosVehiculo = {
        tipo:
          datos.tipoVehiculo,

        marca:
          datos.marca,

        color:
          datos.color,

        cilindraje:
          datos.tipoVehiculo ===
          "moto"
            ? datos.cilindraje ||
              null
            : null,

        modelo:
          datos.tipoVehiculo ===
          "moto"
            ? datos.modelo ||
              null
            : null
      };

      /* ===================================================
         BICICLETA
      =================================================== */

      if (
        datos.tipoVehiculo ===
        "bicicleta"
      ) {
        datosVehiculo.serial =
          datos.serialPlaca ||
          null;

        datosVehiculo.placa =
          null;
      }

      /* ===================================================
         MOTO
      =================================================== */

      if (
        datos.tipoVehiculo ===
        "moto"
      ) {
        datosVehiculo.placa =
          datos.serialPlaca ||
          null;

        datosVehiculo.serial =
          null;
      }

      /* ===================================================
         FOTO
      =================================================== */

      if (solicitud.fotoNueva) {
        datosVehiculo.foto_principal =
          normalizarRuta(
            solicitud.fotoNueva
          );

        datosVehiculo.foto_secundaria =
          normalizarRuta(
            solicitud.fotoNueva
          );
      }

      console.log(
        "🟡 DATOS QUE SE GUARDARÁN EN VEHICULOS:"
      );

      console.log(
        datosVehiculo
      );

      /* ===================================================
         UPDATE VEHÍCULO
      =================================================== */

      const [filasActualizadas] =
        await Vehiculo.update(
          datosVehiculo,
          {
            where: {
              id: vehiculo.id
            },

            transaction
          }
        );

      console.log(
        "🟢 FILAS VEHÍCULOS ACTUALIZADAS:",
        filasActualizadas
      );

      if (
        filasActualizadas !== 1
      ) {
        console.error(
          "❌ VEHÍCULO NO FUE ACTUALIZADO"
        );

        await transaction.rollback();

        return res.status(400).json({
          message:
            "La base de datos no actualizó el vehículo"
        });
      }

      /* ===================================================
         RECARGAR VEHÍCULO
      =================================================== */

      vehiculoActualizado =
        await Vehiculo.findByPk(
          vehiculo.id,
          {
            transaction
          }
        );

      console.log(
        "✅ VEHÍCULO DESPUÉS DEL UPDATE:"
      );

      console.log(
        vehiculoActualizado.toJSON()
      );
    }

    /* =====================================================
       ACTUALIZAR ESTADO DE SOLICITUD
    ===================================================== */

    console.log(
      "🟡 ACTUALIZANDO ESTADO DE SOLICITUD..."
    );

    const [solicitudActualizada] =
      await SolicitudActualizacion.update(
        {
          estado: "aprobada"
        },
        {
          where: {
            id: solicitudId
          },

          transaction
        }
      );

    console.log(
      "🟢 FILAS SOLICITUD ACTUALIZADAS:",
      solicitudActualizada
    );

    if (
      solicitudActualizada !== 1
    ) {
      console.error(
        "❌ NO SE PUDO CAMBIAR EL ESTADO"
      );

      await transaction.rollback();

      return res.status(400).json({
        message:
          "No se pudo actualizar el estado de la solicitud"
      });
    }

    /* =====================================================
       CONFIRMAR TRANSACCIÓN
    ===================================================== */

    await transaction.commit();

    console.log(
      "✅ TRANSACCIÓN CONFIRMADA"
    );

    /* =====================================================
       REGENERAR CARNET
    ===================================================== */

    console.log(
      "🟡 REGENERANDO CARNET..."
    );

    const resultadoCarnet =
      await generarOCrearCarnet(
        solicitud.userId
      );

    console.log(
      "✅ CARNET REGENERADO"
    );

    /* =====================================================
       NOTIFICACIÓN
    ===================================================== */

    await Notificacion.create({
      userId:
        solicitud.userId,

      mensaje:
        "Datos actualizados y carnet regenerado correctamente."
    });

    console.log(
      "✅ NOTIFICACIÓN CREADA"
    );

    /* =====================================================
       RESPUESTA
    ===================================================== */

    console.log(
      "=============================================="
    );

    console.log(
      "🎉 APROBACIÓN COMPLETADA"
    );

    console.log(
      "=============================================="
    );

    return res.status(200).json({
      message:
        "Solicitud aprobada y datos actualizados correctamente",

      usuarioActualizado,

      vehiculoActualizado,

      carnet:
        resultadoCarnet.carnet,

      qrImage:
        resultadoCarnet.qrImage
    });

  } catch (error) {
    console.error("");
    console.error(
      "=============================================="
    );

    console.error(
      "❌ ERROR APROBANDO SOLICITUD"
    );

    console.error(
      "❌ MENSAJE:",
      error.message
    );

    console.error(
      "❌ ERROR COMPLETO:",
      error
    );

    console.error(
      "=============================================="
    );

    /* =====================================================
       ROLLBACK
    ===================================================== */

    if (transaction) {
      try {
        await transaction.rollback();

        console.log(
          "🔴 TRANSACCIÓN REVERTIDA"
        );
      } catch (rollbackError) {
        console.error(
          "❌ ERROR EN ROLLBACK:",
          rollbackError
        );
      }
    }

    return res.status(500).json({
      message:
        "Error al aprobar la solicitud",

      error:
        error.message
    });
  }
};

/* =========================================================
   RECHAZAR SOLICITUD
========================================================= */

const rechazarSolicitud = async (req, res) => {
  try {
    const solicitudId =
      Number(req.params.id);

    if (
      !Number.isInteger(solicitudId) ||
      solicitudId <= 0
    ) {
      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido"
      });
    }

    const solicitud =
      await SolicitudActualizacion.findByPk(
        solicitudId
      );

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud no encontrada"
      });
    }

    if (
      solicitud.estado !== "pendiente"
    ) {
      return res.status(400).json({
        message:
          `La solicitud ya fue ${solicitud.estado}`
      });
    }

    await solicitud.update({
      estado: "rechazada"
    });

    await Notificacion.create({
      userId:
        solicitud.userId,

      mensaje:
        "Tu solicitud de actualización fue rechazada."
    });

    return res.status(200).json({
      message:
        "Solicitud rechazada correctamente"
    });

  } catch (error) {
    console.error(
      "❌ ERROR RECHAZAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al rechazar la solicitud",

      error:
        error.message
    });
  }
};

/* =========================================================
   EXPORTAR
========================================================= */

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
};


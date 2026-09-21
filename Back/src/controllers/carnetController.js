const QRCode = require("qrcode");

const Carnet = require("../models/Carnet");
const Vehiculo = require("../models/Vehiculo");
const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const SolicitudCarnet = require("../models/aprendiz/SolicitudCarnet");
const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");

/* =========================================================
   GENERAR CARNET
========================================================= */

const generarCarnet = async (req, res) => {
  try {
    const solicitudId = Number(req.params.id);

    if (!Number.isInteger(solicitudId) || solicitudId <= 0) {
      return res.status(400).json({
        message: "El ID de la solicitud no es válido",
      });
    }

    const solicitud = await SolicitudCarnet.findByPk(solicitudId, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message:
          "La solicitud debe estar aprobada para generar el carnet",
      });
    }

    if (!solicitud.user) {
      return res.status(404).json({
        message: "El usuario asociado a la solicitud no existe",
      });
    }

    if (!solicitud.user.centroFormacionId) {
      return res.status(400).json({
        message:
          "El usuario no tiene un centro de formación asociado",
      });
    }

    const {
      tipoVehiculo,
      marca,
      color,
      serialPlaca,
      cilindraje,
      modelo,
      fotoVehiculo,
      fotoAprendiz,
    } = solicitud;

    if (!tipoVehiculo) {
      return res.status(400).json({
        message: "El tipo de vehículo es obligatorio",
      });
    }

    if (!marca) {
      return res.status(400).json({
        message: "La marca del vehículo es obligatoria",
      });
    }

    if (!color) {
      return res.status(400).json({
        message: "El color del vehículo es obligatorio",
      });
    }

    if (!serialPlaca) {
      return res.status(400).json({
        message:
          "La placa o serial del vehículo es obligatorio",
      });
    }

    if (!fotoVehiculo) {
      return res.status(400).json({
        message: "La foto del vehículo es obligatoria",
      });
    }

    /* =====================================================
       NUEVO QR PARA CADA CARNET
    ===================================================== */

    const codigoQr =
      `SENA-${solicitud.userId}-${solicitud.id}-${Date.now()}`;

    const qrImage =
      await QRCode.toDataURL(codigoQr);

    /* =====================================================
       FOTO DEL APRENDIZ
    ===================================================== */

    if (fotoAprendiz) {
      await solicitud.user.update({
        foto: fotoAprendiz,
      });
    }

    /* =====================================================
       CREAR NUEVO CARNET
    ===================================================== */

    const carnet = await Carnet.create({
      userId: solicitud.userId,
      solicitudId: solicitud.id,
      codigoQr,
      estado: "activo",
    });

    /* =====================================================
       VEHÍCULO
    ===================================================== */

    const datosVehiculo = {
      userId: solicitud.userId,

      tipo: tipoVehiculo,

      id_centro_de_formacion:
        solicitud.user.centroFormacionId,

      marca: String(marca).trim(),

      color: String(color).trim(),

      serial:
        tipoVehiculo === "bicicleta"
          ? String(serialPlaca).trim()
          : null,

      placa:
        tipoVehiculo === "moto"
          ? String(serialPlaca).trim()
          : null,

      cilindraje:
        cilindraje
          ? String(cilindraje).trim()
          : null,

      modelo:
        modelo
          ? String(modelo).trim()
          : null,

      foto_principal: fotoVehiculo,

      foto_secundaria: fotoVehiculo,
    };

    const vehiculoExistente =
      await Vehiculo.findOne({
        where: {
          userId: solicitud.userId,
        },
      });

    let vehiculo;

    if (vehiculoExistente) {
      await vehiculoExistente.update(
        datosVehiculo
      );

      await vehiculoExistente.reload();

      vehiculo = vehiculoExistente;
    } else {
      vehiculo =
        await Vehiculo.create(
          datosVehiculo
        );
    }

    solicitud.estado =
      "carnet_generado";

    await solicitud.save();

    return res.status(200).json({
      message:
        "Nuevo carnet generado correctamente",

      carnet,

      vehiculo,

      qrImage,
    });

  } catch (error) {
    console.error(
      "ERROR GENERAR CARNET:",
      error
    );

    return res.status(500).json({
      message:
        "Error al generar el carnet",

      error:
        error.message,
    });
  }
};


/* =========================================================
   OBTENER TODOS MIS CARNETS
========================================================= */

const obtenerMiCarnet = async (req, res) => {
  try {

    if (!req.user?.id) {
      return res.status(401).json({
        message:
          "Usuario no autenticado",
      });
    }

    const userId = req.user.id;

    const carnets =
      await Carnet.findAll({

        where: {
          userId,
        },

        include: [

          /* =================================================
             USUARIO
          ================================================= */

          {
            model: User,

            as: "user",

            attributes: [
              "id",
              "nombres",
              "apellidos",
              "tipoDocumento",
              "documento",
              "email",
              "celular",
              "ficha",
              "centroFormacionId",
              "fechaVinculacion",
              "fechaFinalizacion",
              "foto",
            ],

            include: [
              {
                model: CentroFormacion,

                as: "centroFormacion",
              },
            ],
          },

          /* =================================================
             SOLICITUD QUE GENERÓ ESTE CARNET
          ================================================= */

          {
            model: SolicitudCarnet,

            as: "solicitud",

            attributes: [
              "id",
              "tipoVehiculo",
              "marca",
              "color",
              "serialPlaca",
              "cilindraje",
              "modelo",
              "fotoVehiculo",
              "fotoAprendiz",
              "estado",
              "createdAt",
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });


    if (!carnets || carnets.length === 0) {
      return res.status(404).json({
        message:
          "El usuario no tiene carnets generados",
      });
    }


    /* =====================================================
       CONSTRUIR TODOS LOS CARNETS
    ===================================================== */

    const resultado =
      await Promise.all(

        carnets.map(
          async (carnet) => {

            const qrImage =
              await QRCode.toDataURL(
                carnet.codigoQr
              );

            const solicitud =
              carnet.solicitud;

            return {

              /* =========================================
                 CARNET
              ========================================= */

              id:
                carnet.id,

              solicitudId:
                carnet.solicitudId,

              estado:
                carnet.estado,

              codigoQr:
                carnet.codigoQr,

              qrImage,

              fechaGeneracion:
                carnet.createdAt,


              /* =========================================
                 APRENDIZ
              ========================================= */

              user:
                carnet.user
                  ? {

                      id:
                        carnet.user.id,

                      nombres:
                        carnet.user.nombres,

                      apellidos:
                        carnet.user.apellidos,

                      tipoDocumento:
                        carnet.user.tipoDocumento,

                      documento:
                        carnet.user.documento,

                      email:
                        carnet.user.email,

                      celular:
                        carnet.user.celular,

                      ficha:
                        carnet.user.ficha,

                      centroFormacionId:
                        carnet.user.centroFormacionId,

                      centroFormacion:
                        carnet.user.centroFormacion,

                      fechaVinculacion:
                        carnet.user.fechaVinculacion,

                      fechaFinalizacion:
                        carnet.user.fechaFinalizacion,

                      foto:
                        carnet.user.foto,

                    }

                  : null,


              /* =========================================
                 FOTO DEL APRENDIZ
              ========================================= */

              fotoAprendiz:
                solicitud?.fotoAprendiz ||
                carnet.user?.foto ||
                null,


              /* =========================================
                 VEHÍCULO DE ESTE CARNET
              ========================================= */

              vehiculo:
                solicitud
                  ? {

                      id:
                        solicitud.id,

                      tipo:
                        solicitud.tipoVehiculo,

                      marca:
                        solicitud.marca,

                      color:
                        solicitud.color,

                      serial:
                        solicitud.tipoVehiculo ===
                        "bicicleta"
                          ? solicitud.serialPlaca
                          : null,

                      placa:
                        solicitud.tipoVehiculo ===
                        "moto"
                          ? solicitud.serialPlaca
                          : null,

                      modelo:
                        solicitud.modelo,

                      cilindraje:
                        solicitud.cilindraje,

                      foto_principal:
                        solicitud.fotoVehiculo,

                      foto_secundaria:
                        solicitud.fotoVehiculo,

                    }

                  : null,
            };
          }
        )
      );


    return res.status(200).json(
      resultado
    );

  } catch (error) {

    console.error(
      "ERROR OBTENER MIS CARNETS:",
      error
    );

    return res.status(500).json({
      message:
        "Error al obtener los carnets",

      error:
        error.message,
    });
  }
};


/* =========================================================
   OBTENER CARNETS PENDIENTES
========================================================= */

const obtenerPendientes = async (req, res) => {
  try {

    const solicitudes =
      await SolicitudCarnet.findAll({

        where: {
          estado: "aprobada",
        },

        include: [
          {
            model: User,

            as: "user",

            attributes: [
              "id",
              "nombres",
              "apellidos",
              "documento",
              "ficha",
              "centroFormacionId",
              "foto",
            ],

            include: [
              {
                model: CentroFormacion,

                as: "centroFormacion",
              },
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    return res.status(200).json(
      solicitudes
    );

  } catch (error) {

    console.error(
      "ERROR OBTENER PENDIENTES:",
      error
    );

    return res.status(500).json({
      message:
        "Error al obtener solicitudes pendientes",

      error:
        error.message,
    });
  }
};


/* =========================================================
   ESCANEAR CARNET
========================================================= */

const escanearCarnet = async (req, res) => {

  try {

    const { codigoQr } =
      req.body;

    if (
      !codigoQr ||
      typeof codigoQr !== "string"
    ) {
      return res.status(400).json({
        message:
          "El código QR es obligatorio",
      });
    }

    const codigo =
      codigoQr.trim();

    if (!codigo) {
      return res.status(400).json({
        message:
          "El código QR no puede estar vacío",
      });
    }

    console.log(
      "🔎 ESCANEANDO QR:",
      codigo
    );

    const carnet =
      await Carnet.findOne({

        where: {
          codigoQr: codigo,
        },

        include: [

          {
            model: User,

            as: "user",

            attributes: [
              "id",
              "nombres",
              "apellidos",
              "tipoDocumento",
              "documento",
              "email",
              "celular",
              "ficha",
              "centroFormacionId",
              "fechaVinculacion",
              "fechaFinalizacion",
              "foto",
            ],

            include: [
              {
                model: CentroFormacion,

                as: "centroFormacion",
              },
            ],
          },

          {
            model: SolicitudCarnet,

            as: "solicitud",
          },
        ],
      });

    if (!carnet) {
      return res.status(404).json({
        message:
          "Carnet no encontrado",
      });
    }

    if (
      carnet.estado !== "activo"
    ) {
      return res.status(403).json({
        message:
          `El carnet está ${carnet.estado}`,
      });
    }

    const solicitud =
      carnet.solicitud;

    const vehiculo =
      solicitud
        ? {

            id:
              solicitud.id,

            foto_principal:
              solicitud.fotoVehiculo,

            foto_secundaria:
              solicitud.fotoVehiculo,

            tipo:
              solicitud.tipoVehiculo,

            marca:
              solicitud.marca,

            color:
              solicitud.color,

            serial:
              solicitud.tipoVehiculo ===
              "bicicleta"
                ? solicitud.serialPlaca
                : null,

            placa:
              solicitud.tipoVehiculo ===
              "moto"
                ? solicitud.serialPlaca
                : null,

            modelo:
              solicitud.modelo,

            cilindraje:
              solicitud.cilindraje,

          }

        : null;


    const ultimoRegistro =
      await EntradaSalidaAprendiz.findOne({

        where: {
          id_aprendiz:
            carnet.userId,
        },

        order: [
          ["createdAt", "DESC"],
        ],
      });


    let nuevoEstado;

    if (
      ultimoRegistro &&
      ultimoRegistro.estado === "dentro"
    ) {
      nuevoEstado = "fuera";
    } else {
      nuevoEstado = "dentro";
    }


    const ahora =
      new Date();

    const fecha =
      ahora
        .toISOString()
        .split("T")[0];


    let registro;


    if (
      nuevoEstado === "dentro"
    ) {

      registro =
        await EntradaSalidaAprendiz.create({

          id_aprendiz:
            carnet.userId,

          id_codigo_gr:
            null,

          fecha,

          hora_entrada:
            ahora,

          hora_salida:
            null,

          estado:
            "dentro",
        });

    } else {

      await ultimoRegistro.update({

        hora_salida:
          ahora,

        estado:
          "fuera",
      });

      await ultimoRegistro.reload();

      registro =
        ultimoRegistro;
    }


    return res.status(200).json({

      message:
        nuevoEstado === "dentro"
          ? "Entrada registrada correctamente"
          : "Salida registrada correctamente",

      tipo:
        nuevoEstado === "dentro"
          ? "entrada"
          : "salida",

      estado:
        nuevoEstado,

      registro: {

        id:
          registro.id,

        id_aprendiz:
          registro.id_aprendiz,

        fecha:
          registro.fecha,

        hora_entrada:
          registro.hora_entrada,

        hora_salida:
          registro.hora_salida,

        estado:
          registro.estado,
      },

      carnet: {

        id:
          carnet.id,

        solicitudId:
          carnet.solicitudId,

        estado:
          carnet.estado,

        codigoQr:
          carnet.codigoQr,
      },

      user:
        carnet.user
          ? {

              id:
                carnet.user.id,

              nombres:
                carnet.user.nombres,

              apellidos:
                carnet.user.apellidos,

              tipoDocumento:
                carnet.user.tipoDocumento,

              documento:
                carnet.user.documento,

              email:
                carnet.user.email,

              celular:
                carnet.user.celular,

              ficha:
                carnet.user.ficha,

              centroFormacionId:
                carnet.user.centroFormacionId,

              centroFormacion:
                carnet.user.centroFormacion,

              fechaVinculacion:
                carnet.user.fechaVinculacion,

              fechaFinalizacion:
                carnet.user.fechaFinalizacion,

              foto:
                carnet.user.foto,
            }

          : null,

      vehiculo,
    });

  } catch (error) {

    console.error(
      "ERROR ESCANEAR CARNET:",
      error
    );

    return res.status(500).json({

      message:
        "Error al escanear el carnet",

      error:
        error.message,
    });
  }
};


/* =========================================================
   EXPORTAR
========================================================= */

module.exports = {

  generarCarnet,

  obtenerMiCarnet,

  obtenerPendientes,

  escanearCarnet,

};
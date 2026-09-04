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
    /* =========================
       VALIDAR ID DE SOLICITUD
    ========================= */

    const solicitudId = Number(req.params.id);

    if (
      !Number.isInteger(solicitudId) ||
      solicitudId <= 0
    ) {
      return res.status(400).json({
        message: "El ID de la solicitud no es válido"
      });
    }


    /* =========================
       BUSCAR SOLICITUD
    ========================= */

    const solicitud = await SolicitudCarnet.findByPk(
      solicitudId,
      {
        include: [
          {
            model: User,
            as: "user"
          }
        ]
      }
    );


    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }


    /* =========================
       VALIDAR ESTADO
    ========================= */

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message:
          "La solicitud debe estar aprobada para generar el carnet"
      });
    }


    /* =========================
       VALIDAR USUARIO
    ========================= */

    if (!solicitud.user) {
      return res.status(400).json({
        message:
          "La solicitud no tiene un usuario asociado"
      });
    }


    if (
      !solicitud.userId ||
      !Number.isInteger(Number(solicitud.userId)) ||
      Number(solicitud.userId) <= 0
    ) {
      return res.status(400).json({
        message:
          "El usuario asociado a la solicitud no es válido"
      });
    }


    /* =========================
       VALIDAR CENTRO DE FORMACIÓN
    ========================= */

    const centroFormacionId = Number(
      solicitud.user.centroFormacionId
    );


    if (
      !Number.isInteger(centroFormacionId) ||
      centroFormacionId <= 0
    ) {
      return res.status(400).json({
        message:
          "El usuario no tiene un centro de formación válido"
      });
    }


    /* =========================
       VALIDAR TIPO DE VEHÍCULO
    ========================= */

    if (!solicitud.tipoVehiculo) {
      return res.status(400).json({
        message:
          "El tipo de vehículo es obligatorio"
      });
    }


    const tipoVehiculo =
      String(solicitud.tipoVehiculo)
        .trim()
        .toLowerCase();


    if (
      !["bicicleta", "moto"].includes(
        tipoVehiculo
      )
    ) {
      return res.status(400).json({
        message:
          "El tipo de vehículo debe ser bicicleta o moto"
      });
    }


    /* =========================
       VALIDAR MARCA
    ========================= */

    if (
      !solicitud.marca ||
      !String(solicitud.marca).trim()
    ) {
      return res.status(400).json({
        message:
          "La marca del vehículo es obligatoria"
      });
    }


    /* =========================
       VALIDAR COLOR
    ========================= */

    if (
      !solicitud.color ||
      !String(solicitud.color).trim()
    ) {
      return res.status(400).json({
        message:
          "El color del vehículo es obligatorio"
      });
    }


    /* =========================
       VALIDAR SERIAL / PLACA
    ========================= */

    if (
      !solicitud.serialPlaca ||
      !String(solicitud.serialPlaca).trim()
    ) {
      return res.status(400).json({
        message:
          "El serial o placa es obligatorio"
      });
    }


    const serialPlaca =
      String(solicitud.serialPlaca)
        .trim()
        .toUpperCase();


    if (
      !/^[A-Z0-9-]+$/.test(serialPlaca)
    ) {
      return res.status(400).json({
        message:
          "El serial o placa solo puede contener letras, números y guiones"
      });
    }


    /* =========================
       VALIDAR FOTOS
    ========================= */

    if (
      !solicitud.fotoAprendiz ||
      !String(solicitud.fotoAprendiz).trim()
    ) {
      return res.status(400).json({
        message:
          "La foto del aprendiz es obligatoria"
      });
    }


    if (
      !solicitud.fotoVehiculo ||
      !String(solicitud.fotoVehiculo).trim()
    ) {
      return res.status(400).json({
        message:
          "La foto del vehículo es obligatoria"
      });
    }


    if (
      !solicitud.formatoDiligenciado ||
      !String(solicitud.formatoDiligenciado).trim()
    ) {
      return res.status(400).json({
        message:
          "El formato diligenciado es obligatorio"
      });
    }


    /* =========================
       VERIFICAR CARNET EXISTENTE
    ========================= */

    const yaExiste = await Carnet.findOne({
      where: {
        userId: solicitud.userId
      }
    });


    if (yaExiste) {
      return res.status(409).json({
        message:
          "El carnet ya existe para este usuario"
      });
    }


    /* =========================
       GENERAR CÓDIGO QR
    ========================= */

    const codigoQr =
      `SENA-${solicitud.userId}-${Date.now()}`;


    const qrImage =
      await QRCode.toDataURL(codigoQr);


    /* =========================
       ACTUALIZAR FOTO DEL USUARIO
    ========================= */

    await solicitud.user.update({
      foto: solicitud.fotoAprendiz
    });


    /* =========================
       CREAR CARNET
    ========================= */

    const carnet = await Carnet.create({
      userId: solicitud.userId,

      solicitudId: solicitud.id,

      codigoQr: codigoQr,

      estado: "activo"
    });


    /* =========================
       BUSCAR VEHÍCULO EXISTENTE
    ========================= */

    const vehiculoExistente =
      await Vehiculo.findOne({
        where: {
          userId: solicitud.userId
        }
      });


    /* =========================
       CREAR VEHÍCULO
    ========================= */

    if (!vehiculoExistente) {

      const datosVehiculo = {
        userId: solicitud.userId,

        tipo: tipoVehiculo,

        /*
          IMPORTANTE:
          Aquí debe ir el ID del centro
          de formación.

          NO debe ir la ficha.
        */
        id_centro_de_formacion:
          centroFormacionId,

        marca:
          String(solicitud.marca).trim(),

        color:
          String(solicitud.color).trim(),

        serial:
          tipoVehiculo === "bicicleta"
            ? serialPlaca
            : null,

        placa:
          tipoVehiculo === "moto"
            ? serialPlaca
            : null,

        cilindraje:
          solicitud.cilindraje
            ? String(solicitud.cilindraje).trim()
            : null,

        modelo:
          solicitud.modelo
            ? String(solicitud.modelo).trim()
            : null,

        foto_principal:
          solicitud.fotoVehiculo,

        foto_secundaria:
          solicitud.fotoVehiculo
      };


      await Vehiculo.create(
        datosVehiculo
      );
    }


    /* =========================
       CAMBIAR ESTADO SOLICITUD
    ========================= */

    solicitud.estado =
      "carnet_generado";


    await solicitud.save();


    /* =========================
       RESPUESTA
    ========================= */

    return res.status(200).json({
      message:
        "Carnet generado correctamente",

      carnet,

      qrImage
    });


  } catch (error) {

    console.error(
      "ERROR GENERANDO CARNET:",
      error
    );


    /* =========================
       ERROR DE VALIDACIÓN
    ========================= */

    if (
      error.name ===
      "SequelizeValidationError"
    ) {

      return res.status(400).json({

        message:
          "Los datos enviados no son válidos",

        errores:
          error.errors.map((err) => ({
            campo: err.path,

            mensaje: err.message
          }))
      });
    }


    /* =========================
       ERROR DE VALOR ÚNICO
    ========================= */

    if (
      error.name ===
      "SequelizeUniqueConstraintError"
    ) {

      return res.status(409).json({
        message:
          "Ya existe un registro con uno de los datos enviados"
      });
    }


    /* =========================
       ERROR GENERAL
    ========================= */

    return res.status(500).json({
      message:
        "Error generando carnet"
    });
  }
};


/* =========================================================
   OBTENER MI CARNET
========================================================= */
const obtenerMiCarnet = async (req, res) => {

  try {

    /* =========================
       VALIDAR USUARIO AUTENTICADO
    ========================= */

    if (
      !req.user ||
      !req.user.id
    ) {
      return res.status(401).json({
        message:
          "Usuario no autenticado"
      });
    }


    const userId = Number(req.user.id);


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    /* =========================
       BUSCAR CARNET
    ========================= */

    const carnet =
      await Carnet.findOne({

        where: {
          userId: userId
        },

        include: [

          {
            model: User,

            as: "user",

            include: [

              {
                model: CentroFormacion,

                as: "centroFormacion"
              }

            ]
          }

        ]

      });


    if (!carnet) {

      return res.status(404).json({
        message:
          "No tiene carnet generado"
      });

    }


    /* =========================
       VALIDAR RELACIÓN USUARIO
    ========================= */

    if (!carnet.user) {

      return res.status(500).json({
        message:
          "No fue posible obtener la información del usuario"
      });

    }


    /* =========================
       BUSCAR VEHÍCULO
    ========================= */

    const vehiculo =
      await Vehiculo.findOne({

        where: {
          userId: userId
        }

      });


    /* =========================
       GENERAR QR
    ========================= */

    if (!carnet.codigoQr) {

      return res.status(500).json({
        message:
          "El carnet no tiene un código QR válido"
      });

    }


    const qrImage =
      await QRCode.toDataURL(
        carnet.codigoQr
      );


    /* =========================
       RESPUESTA
    ========================= */

    return res.status(200).json({

      nombre:
        `${carnet.user.nombres} ${carnet.user.apellidos}`,

      nombres:
        carnet.user.nombres,

      apellidos:
        carnet.user.apellidos,

      tipoDocumento:
        carnet.user.tipoDocumento,

      documento:
        carnet.user.documento,

      correo:
        carnet.user.email,

      celular:
        carnet.user.celular,

      ficha:
        carnet.user.ficha,

      centroFormacion:
        carnet.user.centroFormacion?.nombre || "",

      fechaVinculacion:
        carnet.user.fechaVinculacion,

      fechaFinalizacion:
        carnet.user.fechaFinalizacion,

      fotoAprendiz:
        carnet.user.foto || null,

      fotoVehiculo:
        vehiculo?.foto_principal || null,

      tipoVehiculo:
        vehiculo?.tipo || null,

      marca:
        vehiculo?.marca || null,

      color:
        vehiculo?.color || null,

      serial:
        vehiculo?.serial || null,

      placa:
        vehiculo?.placa || null,

      modelo:
        vehiculo?.modelo || null,

      cilindraje:
        vehiculo?.cilindraje || null,

      estado:
        carnet.estado,

      qr:
        qrImage
    });


  } catch (error) {

    console.error(
      "ERROR OBTENIENDO CARNET:",
      error
    );


    return res.status(500).json({
      message:
        "Error obteniendo el carnet"
    });

  }
};


/* =========================================================
   ESCANEAR QR
========================================================= */
const escanearQr = async (req, res) => {

  try {

    /* =========================
       OBTENER QR
    ========================= */

    const { codigoQr } =
      req.body || {};


    /* =========================
       VALIDAR QR
    ========================= */

    if (
      typeof codigoQr !== "string" ||
      !codigoQr.trim()
    ) {

      return res.status(400).json({
        message:
          "Debe enviar un código QR válido"
      });

    }


    const codigoLimpio =
      codigoQr.trim();


    /* =========================
       VALIDAR LONGITUD
    ========================= */

    if (
      codigoLimpio.length < 5 ||
      codigoLimpio.length > 255
    ) {

      return res.status(400).json({
        message:
          "El código QR no tiene un formato válido"
      });

    }


    /* =========================
       BUSCAR CARNET
    ========================= */

    const carnet =
      await Carnet.findOne({

        where: {
          codigoQr:
            codigoLimpio
        },

        include: [

          {
            model: User,

            as: "user",

            include: [

              {
                model: CentroFormacion,

                as: "centroFormacion"
              }

            ]

          }

        ]

      });


    /* =========================
       CARNET NO EXISTE
    ========================= */

    if (!carnet) {

      return res.status(404).json({
        message:
          "Carnet no encontrado"
      });

    }


    /* =========================
       USUARIO NO EXISTE
    ========================= */

    if (!carnet.user) {

      return res.status(404).json({
        message:
          "El usuario asociado al carnet no existe"
      });

    }


    /* =========================
       USUARIO BLOQUEADO
    ========================= */

    if (
      carnet.user.estado ===
      "bloqueado"
    ) {

      return res.status(403).json({
        message:
          "Usuario bloqueado. No puede ingresar."
      });

    }


    /* =========================
       CARNET INACTIVO
    ========================= */

    if (
      carnet.estado !==
      "activo"
    ) {

      return res.status(403).json({
        message:
          "El carnet no está activo"
      });

    }


    /* =========================
       FECHA ACTUAL
    ========================= */

    const hoy =
      new Date()
        .toISOString()
        .split("T")[0];


    /* =========================
       BUSCAR REGISTRO ACTUAL
    ========================= */

    let registro =
      await EntradaSalidaAprendiz.findOne({

        where: {

          id_aprendiz:
            carnet.userId,

          fecha:
            hoy,

          hora_salida:
            null

        }

      });


    let movimiento;


    /* =====================================================
       ENTRADA
    ===================================================== */

    if (!registro) {

      registro =
        await EntradaSalidaAprendiz.create({

          id_aprendiz:
            carnet.userId,

          fecha:
            hoy,

          hora_entrada:
            new Date(),

          estado:
            "dentro"

        });


      movimiento =
        "entrada";

    }


    /* =====================================================
       SALIDA
    ===================================================== */

    else {

      registro.hora_salida =
        new Date();


      registro.estado =
        "fuera";


      await registro.save();


      movimiento =
        "salida";

    }


    /* =========================
       BUSCAR VEHÍCULO
    ========================= */

    const vehiculo =
      await Vehiculo.findOne({

        where: {
          userId:
            carnet.userId
        }

      });


    /* =========================
       GENERAR QR
    ========================= */

    const qrImage =
      await QRCode.toDataURL(
        carnet.codigoQr
      );


    /* =========================
       RESPUESTA
    ========================= */

    return res.status(200).json({

      movimiento,

      registro,

      carnet: {

        nombre:
          `${carnet.user.nombres} ${carnet.user.apellidos}`,

        documento:
          carnet.user.documento,

        ficha:
          carnet.user.ficha,

        correo:
          carnet.user.email,

        celular:
          carnet.user.celular,

        centroFormacion:
          carnet.user.centroFormacion?.nombre || "",

        fotoAprendiz:
          carnet.user.foto || null,

        fotoVehiculo:
          vehiculo?.foto_principal || null,

        tipoVehiculo:
          vehiculo?.tipo || null,

        marca:
          vehiculo?.marca || null,

        color:
          vehiculo?.color || null,

        placa:
          vehiculo?.placa || null,

        serial:
          vehiculo?.serial || null,

        modelo:
          vehiculo?.modelo || null,

        cilindraje:
          vehiculo?.cilindraje || null,

        qr:
          qrImage

      }

    });


  } catch (error) {

    console.error(
      "ERROR ESCANEANDO QR:",
      error
    );


    /* =========================
       ERROR DE VALIDACIÓN
    ========================= */

    if (
      error.name ===
      "SequelizeValidationError"
    ) {

      return res.status(400).json({

        message:
          "Los datos del registro no son válidos",

        errores:
          error.errors.map((err) => ({
            campo: err.path,
            mensaje: err.message
          }))

      });

    }


    /* =========================
       ERROR GENERAL
    ========================= */

    return res.status(500).json({
      message:
        "Error procesando el código QR"
    });

  }
};


/* =========================================================
   CARNETS PENDIENTES
========================================================= */
const obtenerCarnetsPendientes = async (
  req,
  res
) => {

  try {

    const solicitudes =
      await SolicitudCarnet.findAll({

        where: {
          estado: "aprobada"
        },

        include: [

          {
            model: User,

            as: "user"

          }

        ]

      });


    return res.status(200).json(
      solicitudes
    );


  } catch (error) {

    console.error(
      "ERROR OBTENIENDO PENDIENTES:",
      error
    );


    return res.status(500).json({
      message:
        "Error obteniendo las solicitudes pendientes"
    });

  }

};


/* =========================================================
   EXPORTAR
========================================================= */

module.exports = {

  generarCarnet,

  obtenerCarnetsPendientes,

  obtenerMiCarnet,

  escanearQr

};
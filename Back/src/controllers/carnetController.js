const QRCode = require("qrcode");

const Carnet = require("../models/Carnet");
const Vehiculo = require("../models/Vehiculo");
const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const SolicitudCarnet = require("../models/aprendiz/SolicitudCarnet");
const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");

/* =========================
   GENERAR CARNET
========================= */
const generarCarnet = async (req, res) => {
  try {
    const solicitud = await SolicitudCarnet.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message: "La solicitud debe estar aprobada"
      });
    }

    const yaExiste = await Carnet.findOne({
      where: {
        userId: solicitud.userId
      }
    });

    if (yaExiste) {
      return res.status(400).json({
        message: "El carnet ya existe para este usuario"
      });
    }

    // Código único del QR
    const codigoQr = `SENA-${solicitud.userId}-${Date.now()}`;

    // Generar imagen QR
    const qrImage = await QRCode.toDataURL(codigoQr);

    // Guardar foto del aprendiz en User
    await solicitud.user.update({
      foto: solicitud.fotoAprendiz
    });

    // Crear carnet
    const carnet = await Carnet.create({
      userId: solicitud.userId,
      solicitudId: solicitud.id,
      codigoQr: codigoQr,
      estado: "activo"
    });

    // Buscar vehículo existente
    const vehiculoExistente = await Vehiculo.findOne({
      where: {
        userId: solicitud.userId
      }
    });

    // Crear vehículo si no existe
    if (!vehiculoExistente && solicitud.tipoVehiculo) {
      await Vehiculo.create({
        userId: solicitud.userId,
        tipo: solicitud.tipoVehiculo,

        id_centro_de_formacion: solicitud.user?.ficha || null,

        marca: solicitud.marca,
        color: solicitud.color,

        serial:
          solicitud.tipoVehiculo === "bicicleta"
            ? solicitud.serialPlaca
            : null,

        placa:
          solicitud.tipoVehiculo === "moto"
            ? solicitud.serialPlaca
            : null,

        cilindraje: solicitud.cilindraje,
        modelo: solicitud.modelo,

        foto_principal: solicitud.fotoVehiculo,
        foto_secundaria: solicitud.fotoVehiculo
      });
    }

    // Cambiar estado de solicitud
    solicitud.estado = "carnet_generado";
    await solicitud.save();

    return res.json({
      message: "Carnet generado correctamente",
      carnet,
      qrImage
    });

  } catch (error) {
    console.error("ERROR GENERANDO CARNET:", error);

    return res.status(500).json({
      message: "Error generando carnet",
      error: error.message
    });
  }
};


/* =========================
   MI CARNET
========================= */
const obtenerMiCarnet = async (req, res) => {
  try {
    const carnet = await Carnet.findOne({
      where: {
        userId: req.user.id
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
        message: "No tiene carnet generado"
      });
    }

    const vehiculo = await Vehiculo.findOne({
      where: {
        userId: req.user.id
      }
    });

    // Generar nuevamente la imagen del QR
    const qrImage = await QRCode.toDataURL(
      carnet.codigoQr
    );

    return res.json({

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
      message: error.message
    });
  }
};


/* =========================
   ESCANEAR QR
========================= */
const escanearQr = async (req, res) => {
  try {

    const { codigoQr } = req.body;

    console.log("=================================");
    console.log("QR RECIBIDO:", codigoQr);
    console.log("=================================");

    // Validar que llegue el QR
    if (!codigoQr) {
      return res.status(400).json({
        message: "No se recibió el código QR"
      });
    }

    // Limpiar espacios
    const codigoLimpio = String(codigoQr).trim();

    console.log(
      "QR LIMPIO:",
      codigoLimpio
    );

    // Buscar carnet
    const carnet = await Carnet.findOne({
      where: {
        codigoQr: codigoLimpio
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

    console.log(
      "CARNET ENCONTRADO:",
      carnet ? carnet.id : "NO ENCONTRADO"
    );

    // Si no existe
    if (!carnet) {
      return res.status(404).json({
        message: "Carnet no encontrado"
      });
    }

    // Usuario bloqueado
    if (carnet.user?.estado === "bloqueado") {
      return res.status(403).json({
        message:
          "Usuario bloqueado. No puede ingresar."
      });
    }

    // Carnet inactivo
    if (carnet.estado !== "activo") {
      return res.status(400).json({
        message: "Carnet inactivo"
      });
    }

    // Fecha actual
    const hoy = new Date()
      .toISOString()
      .split("T")[0];

    // Buscar si está actualmente dentro
    let registro =
      await EntradaSalidaAprendiz.findOne({
        where: {
          id_aprendiz: carnet.userId,
          fecha: hoy,
          hora_salida: null
        }
      });

    let movimiento;

    /* =========================
       ENTRADA
    ========================= */

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

      movimiento = "entrada";

    }

    /* =========================
       SALIDA
    ========================= */

    else {

      registro.hora_salida =
        new Date();

      registro.estado =
        "fuera";

      await registro.save();

      movimiento = "salida";
    }

    // Buscar vehículo
    const vehiculo =
      await Vehiculo.findOne({
        where: {
          userId: carnet.userId
        }
      });

    // Generar QR
    const qrImage =
      await QRCode.toDataURL(
        carnet.codigoQr
      );

    console.log(
      "MOVIMIENTO:",
      movimiento
    );

    return res.json({

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

    return res.status(500).json({
      message: error.message
    });
  }
};


/* =========================
   CARNETS PENDIENTES
========================= */
const obtenerCarnetsPendientes = async (req, res) => {

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

    return res.json(
      solicitudes
    );

  } catch (error) {

    console.error(
      "ERROR OBTENIENDO PENDIENTES:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
};


/* =========================
   EXPORTAR
========================= */
module.exports = {

  generarCarnet,

  obtenerCarnetsPendientes,

  obtenerMiCarnet,

  escanearQr

};
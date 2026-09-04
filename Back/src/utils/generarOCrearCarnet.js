const QRCode = require("qrcode");
const Carnet = require("../models/Carnet");

/* =========================================================
   GENERAR O ACTUALIZAR CARNET
========================================================= */

const generarOCrearCarnet = async (
  userId,
  solicitudId = null
) => {

  /* =========================
     VALIDAR USER ID
  ========================= */
  if (
    !Number.isInteger(Number(userId)) ||
    Number(userId) <= 0
  ) {
    throw new Error(
      "El ID del usuario no es válido"
    );
  }

  const idUsuario = Number(userId);

  /* =========================
     GENERAR QR
  ========================= */
  const codigoQr =
    `SENA-${idUsuario}-${Date.now()}`;

  const qrImage =
    await QRCode.toDataURL(codigoQr);

  /* =========================
     BUSCAR CARNET
  ========================= */
  let carnet =
    await Carnet.findOne({
      where: {
        userId: idUsuario
      }
    });

  /* =====================================================
     SI EL CARNET NO EXISTE
  ===================================================== */
  if (!carnet) {

    /* =========================
       SOLICITUD OBLIGATORIA
    ========================= */
    if (
      !Number.isInteger(Number(solicitudId)) ||
      Number(solicitudId) <= 0
    ) {
      throw new Error(
        "Se necesita una solicitud válida para crear el carnet"
      );
    }

    carnet =
      await Carnet.create({
        userId: idUsuario,

        solicitudId:
          Number(solicitudId),

        codigoQr,

        estado: "activo"
      });

  }

  /* =====================================================
     SI EL CARNET YA EXISTE
     
     IMPORTANTE:
     NO modificar solicitudId.
     
     El carnet conserva la solicitud original
     con la que fue generado.
  ===================================================== */
  else {

    await carnet.update({
      codigoQr,

      estado: "activo"
    });

    await carnet.reload();
  }

  /* =========================
     RESULTADO
  ========================= */
  return {
    carnet,
    qrImage
  };
};

module.exports =
  generarOCrearCarnet;

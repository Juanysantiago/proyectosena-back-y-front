const QRCode = require("qrcode");
const Carnet = require("../models/Carnet");

const generarOCrearCarnet = async (userId, solicitudId) => {
  const codigoQr = `SENA-${userId}-${Date.now()}`;
  const qrImage = await QRCode.toDataURL(codigoQr);

  let carnet = await Carnet.findOne({ where: { userId } });

  if (!carnet) {
    carnet = await Carnet.create({
      userId,
      solicitudId,
      codigoQr,
      estado: "activo"
    });
  } else {
    await carnet.update({
      codigoQr,
      solicitudId,
      estado: "activo"
    });

    await carnet.reload();
  }

  return { carnet, qrImage };
};

module.exports = generarOCrearCarnet;
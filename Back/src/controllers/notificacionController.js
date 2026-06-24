const Notificacion =
require("../models/Notificacion");

const obtenerNotificaciones =
async (req, res) => {
  try {

    const data =
    await Notificacion.findAll({
      where: {
        userId: req.user.id
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  obtenerNotificaciones
};
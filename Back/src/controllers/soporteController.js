const Soporte = require("../models/Soporte");
const User = require("../models/User");

exports.crearSoporte = async (req, res) => {
  try {

    const { asunto, descripcion } = req.body;

    const soporte = await Soporte.create({

      asunto,

      descripcion,

      userId: req.user.id

    });

    res.status(201).json(soporte);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.obtenerMisSoportes = async (req, res) => {

  try {

    const soportes = await Soporte.findAll({

      where: {

        userId: req.user.id

      },

      order: [["createdAt","DESC"]]

    });

    res.json(soportes);

  } catch (error) {

    res.status(500).json({
      message:error.message
    });

  }

};

exports.obtenerTodos = async (req, res) => {
  try {

    const soportes = await Soporte.findAll({

      where: {
        estado: "Pendiente"
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email"
          ]
        }
      ],

      order: [["createdAt", "DESC"]]

    });

    res.json(soportes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
exports.obtenerReportesRecibidos = async (req, res) => {

  try {

    const reportes = await Soporte.findAll({

      where: {
        estado: "Resuelto"
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email"
          ]
        }
      ],

      order: [["updatedAt", "DESC"]]

    });

    res.json(reportes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.responderSoporte = async (req, res) => {
  try {

    const soporte = await Soporte.findByPk(req.params.id);

    if (!soporte) {
      return res.status(404).json({
        message: "Soporte no encontrado"
      });
    }

    soporte.respuesta = req.body.respuesta;

    // Al responder cambia automáticamente a Resuelto
    soporte.estado = "Resuelto";

    await soporte.save();

    res.json(soporte);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

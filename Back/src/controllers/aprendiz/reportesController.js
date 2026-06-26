const { Reporte, User } = require("../../models");

exports.crearReporte = async (req, res) => {
  try {
    const { descripcion } = req.body;

    const reporte = await Reporte.create({
      descripcion,
      userId: req.user.id,
    });

    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

exports.obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "nombres",
            "apellidos",
            "email",
            "ficha",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reportes);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

exports.marcarLeido = async (req, res) => {
  try {
    const reporte = await Reporte.findByPk(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        mensaje: "Reporte no encontrado",
      });
    }

    reporte.estado = "Leído";

    await reporte.save();

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};
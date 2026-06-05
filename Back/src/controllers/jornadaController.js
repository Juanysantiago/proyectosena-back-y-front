const Jornada = require("../models/Jornada");

// Crear jornada
const createJornada = async (req, res) => {
  try {
    const {
      sigla_jornada,
      nombre_jornada,
      descripcion,
      imagen_url,
      estado,
    } = req.body;

    if (!sigla_jornada || !nombre_jornada) {
      return res.status(400).json({
        message: "Sigla y nombre de jornada son obligatorios",
      });
    }

    const existente = await Jornada.findOne({
      where: { sigla_jornada },
    });

    if (existente) {
      return res.status(409).json({
        message: "Ya existe una jornada con esa sigla",
      });
    }

    const nueva = await Jornada.create({
      sigla_jornada,
      nombre_jornada,
      descripcion,
      imagen_url,
      estado,
    });

    return res.status(201).json({
      message: "Jornada creada correctamente",
      data: nueva,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// Obtener todas
const getJornadas = async (req, res) => {
  try {
    const data = await Jornada.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener jornadas",
    });
  }
};

module.exports = {
  createJornada,
  getJornadas,
};
const ConfigGr = require("../models/ConfigGr");

// Crear configuración GR
const createConfigGr = async (req, res) => {
  try {
    const {
      art_direccion_gr,
      fecha_conexion,
      id_calcular,
    } = req.body;

    if (!art_direccion_gr || !fecha_conexion || !id_calcular) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const nueva = await ConfigGr.create({
      art_direccion_gr,
      fecha_conexion,
      id_calcular,
    });

    return res.status(201).json({
      message: "Configuración creada correctamente",
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
const getConfigGr = async (req, res) => {
  try {
    const data = await ConfigGr.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener configuraciones",
    });
  }
};

module.exports = {
  createConfigGr,
  getConfigGr,
};
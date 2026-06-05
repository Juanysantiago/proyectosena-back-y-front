const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");

// Crear registro entrada/salida
const createRegistro = async (req, res) => {
  try {
    const {
      hora_entrada,
      hora_salida,
      id_aprendiz,
      id_codigo_gr,
    } = req.body;

    if (!hora_entrada || !id_aprendiz || !id_codigo_gr) {
      return res.status(400).json({
        message: "hora_entrada, id_aprendiz e id_codigo_gr son obligatorios",
      });
    }

    const nuevo = await EntradaSalidaAprendiz.create({
      hora_entrada,
      hora_salida,
      id_aprendiz,
      id_codigo_gr,
    });

    return res.status(201).json({
      message: "Registro creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// Obtener todos los registros
const getRegistros = async (req, res) => {
  try {
    const data = await EntradaSalidaAprendiz.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener registros",
    });
  }
};

module.exports = {
  createRegistro,
  getRegistros,
};
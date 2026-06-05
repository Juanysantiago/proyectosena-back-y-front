const TipoDocumento = require("../models/TipoDocumento");

// Crear tipo de documento
const createTipoDocumento = async (req, res) => {
  try {
    const { sigla, nombre_documento } = req.body;

    if (!sigla || !nombre_documento) {
      return res.status(400).json({
        message: "Sigla y nombre_documento son obligatorios",
      });
    }

    const existente = await TipoDocumento.findOne({
      where: { sigla },
    });

    if (existente) {
      return res.status(409).json({
        message: "Ya existe un tipo de documento con esa sigla",
      });
    }

    const nuevo = await TipoDocumento.create({
      sigla,
      nombre_documento,
    });

    return res.status(201).json({
      message: "Tipo de documento creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// Obtener todos
const getTipoDocumentos = async (req, res) => {
  try {
    const data = await TipoDocumento.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener los tipos de documento",
    });
  }
};

module.exports = {
  createTipoDocumento,
  getTipoDocumentos,
};
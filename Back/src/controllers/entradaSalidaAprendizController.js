const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");

// CREAR ENTRADA
const createRegistro = async (req, res) => {
  try {
    const { id_aprendiz, id_codigo_gr } = req.body;

    if (!id_aprendiz || !id_codigo_gr) {
      return res.status(400).json({
        message: "id_aprendiz e id_codigo_gr son obligatorios",
      });
    }

    const nuevo = await EntradaSalidaAprendiz.create({
      hora_entrada: new Date(),
      hora_salida: null,
      id_aprendiz,
      id_codigo_gr,
    });

    return res.status(201).json({
      message: "Entrada registrada",
      data: nuevo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando registro",
      error,
    });
  }
};

// LISTAR
const getRegistros = async (req, res) => {
  try {
    const data = await EntradaSalidaAprendiz.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo registros",
      error,
    });
  }
};

// ACTUALIZAR (SALIDA O EDICIÓN)
const updateRegistro = async (req, res) => {
  try {
    const item = await EntradaSalidaAprendiz.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.update(req.body);

    return res.json({
      message: "Actualizado correctamente",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando",
      error,
    });
  }
};

// ELIMINAR
const deleteRegistro = async (req, res) => {
  try {
    const item = await EntradaSalidaAprendiz.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.destroy();

    return res.json({
      message: "Eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando",
      error,
    });
  }
};

module.exports = {
  createRegistro,
  getRegistros,
  updateRegistro,
  deleteRegistro,
};
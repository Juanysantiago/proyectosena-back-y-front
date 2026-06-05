const ConfigGr = require("../models/ConfigGr");

// LISTAR
const getConfigGr = async (req, res) => {
  try {
    const data = await ConfigGr.findAll();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo configuraciones",
      error: error.message
    });
  }
};

// CREAR
const createConfigGr = async (req, res) => {
  try {
    const nuevo = await ConfigGr.create(req.body);

    return res.status(201).json({
      message: "Creado correctamente",
      data: nuevo
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando configuración",
      error: error.message
    });
  }
};

// ACTUALIZAR
const updateConfigGr = async (req, res) => {
  try {
    const item = await ConfigGr.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.update(req.body);

    return res.json({
      message: "Actualizado",
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando",
      error: error.message
    });
  }
};

// ELIMINAR
const deleteConfigGr = async (req, res) => {
  try {
    const item = await ConfigGr.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.destroy();

    return res.json({
      message: "Eliminado"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando",
      error: error.message
    });
  }
};

module.exports = {
  getConfigGr,
  createConfigGr,
  updateConfigGr,
  deleteConfigGr
};
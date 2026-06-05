const Vehiculo = require("../models/Vehiculo");

// Crear
const createVehiculo = async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);

    const nuevo = await Vehiculo.create(req.body);

    return res.status(201).json({
      message: "Vehículo creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.log("🔥 ERROR REAL CREATE:", error);

    return res.status(500).json({
      message: "Error creando vehículo",
      error: error.message,
    });
  }
};

// Obtener todos
const getVehiculos = async (req, res) => {
  try {
    const data = await Vehiculo.findAll();

    return res.json({ data });
  } catch (error) {
    console.log("🔥 ERROR REAL GET ALL:", error);

    return res.status(500).json({
      message: "Error obteniendo vehículos",
      error: error.message,
    });
  }
};

// Obtener por ID
const getVehiculoById = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({ message: "No encontrado" });
    }

    return res.json({ data: vehiculo });
  } catch (error) {
    console.log("🔥 ERROR REAL GET BY ID:", error);

    return res.status(500).json({
      message: "Error buscando vehículo",
      error: error.message,
    });
  }
};

// Actualizar
const updateVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await vehiculo.update(req.body);

    return res.json({
      message: "Actualizado correctamente",
      data: vehiculo,
    });
  } catch (error) {
    console.log("🔥 ERROR REAL UPDATE:", error);

    return res.status(500).json({
      message: "Error actualizando vehículo",
      error: error.message,
    });
  }
};

// Eliminar
const deleteVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await vehiculo.destroy();

    return res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    console.log("🔥 ERROR REAL DELETE:", error);

    return res.status(500).json({
      message: "Error eliminando vehículo",
      error: error.message,
    });
  }
};

module.exports = {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
};
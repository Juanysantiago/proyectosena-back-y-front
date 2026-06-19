const Vehiculo = require("../models/Vehiculo");

// Crear
const createVehiculo = async (req, res) => {
  try {
    const { tipo, id_centro_de_formacion, marca } = req.body;

    if (!tipo) {
      return res.status(400).json({
        message: "Tipo obligatorio",
      });
    }

    if (!id_centro_de_formacion) {
      return res.status(400).json({
        message: "Centro de formación obligatorio",
      });
    }

    if (!marca) {
      return res.status(400).json({
        message: "Marca obligatoria",
      });
    }

   const nuevo = await Vehiculo.create({
  ...req.body,
  userId: req.user.id
});

    return res.status(201).json({
      message: "Vehículo creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.log(error);

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

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.log(error);

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
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    return res.status(200).json({
      data: vehiculo,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error obteniendo vehículo",
      error: error.message,
    });
  }
};

// Actualizar
const updateVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    await vehiculo.update(req.body);

    return res.status(200).json({
      message: "Vehículo actualizado",
      data: vehiculo,
    });
  } catch (error) {
    console.log(error);

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
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    await vehiculo.destroy();

    return res.status(200).json({
      message: "Vehículo eliminado",
    });
  } catch (error) {
    console.log(error);

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
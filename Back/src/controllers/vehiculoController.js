const Vehiculo = require("../models/Vehiculo");

// Crear vehículo
const createVehiculo = async (req, res) => {
  try {
    const {
      tipo,
      id_centro_de_formacion,
      marca,
      color,
      serial,
      placa,
      cilindraje,
      modelo,
      foto_principal,
      foto_secundaria,
    } = req.body;

    if (!tipo || !marca || !placa) {
      return res.status(400).json({
        message: "Tipo, marca y placa son obligatorios",
      });
    }

    const existente = await Vehiculo.findOne({
      where: { placa },
    });

    if (existente) {
      return res.status(409).json({
        message: "Ya existe un vehículo con esa placa",
      });
    }

    const nuevo = await Vehiculo.create({
      tipo,
      id_centro_de_formacion,
      marca,
      color,
      serial,
      placa,
      cilindraje,
      modelo,
      foto_principal,
      foto_secundaria,
    });

    return res.status(201).json({
      message: "Vehículo creado correctamente",
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
const getVehiculos = async (req, res) => {
  try {
    const data = await Vehiculo.findAll();

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener vehículos",
    });
  }
};

module.exports = {
  createVehiculo,
  getVehiculos,
};
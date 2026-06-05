const express = require("express");
const {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
} = require("../controllers/vehiculoController");

const router = express.Router();

/* LISTAR */
router.get("/", getVehiculos);

/* CREAR */
router.post("/", createVehiculo);

/* OBTENER POR ID */
router.get("/:id", getVehiculoById);

/* ACTUALIZAR */
router.put("/:id", updateVehiculo);

/* ELIMINAR */
router.delete("/:id", deleteVehiculo);

module.exports = router;
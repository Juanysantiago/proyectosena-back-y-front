const express = require("express");

const {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
} = require("../controllers/vehiculoController");

const router = express.Router();

router.get("/", getVehiculos);

router.post("/", createVehiculo);

router.get("/:id", getVehiculoById);

router.put("/:id", updateVehiculo);

router.delete("/:id", deleteVehiculo);

module.exports = router;
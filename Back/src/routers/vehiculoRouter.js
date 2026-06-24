const express = require("express");

const {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
  getMisVehiculos
} = require("../controllers/vehiculoController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyToken, getVehiculos);

router.post("/", verifyToken, createVehiculo);

// IMPORTANTE: antes de "/:id"
router.get(
  "/mis-vehiculos",
  verifyToken,
  getMisVehiculos
);

router.get("/:id", verifyToken, getVehiculoById);

router.put("/:id", verifyToken, updateVehiculo);

router.delete("/:id", verifyToken, deleteVehiculo);

module.exports = router;
const express = require("express");
const {
  createVehiculo,
  getVehiculos,
} = require("../controllers/vehiculoController");

const router = express.Router();

/* ✔ LISTAR VEHICULOS */
router.get("/", getVehiculos);

/* ✔ CREAR VEHICULO */
router.post("/vehiculo", createVehiculo);

module.exports = router;
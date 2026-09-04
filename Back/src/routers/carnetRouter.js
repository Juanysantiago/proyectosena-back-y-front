const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  generarCarnet,
  obtenerPendientes,
  obtenerMiCarnet,
  escanearCarnet
} = require("../controllers/carnetController");


router.get(
  "/pendientes",
  verifyToken,
  obtenerPendientes
);


router.post(
  "/generar/:id",
  verifyToken,
  generarCarnet
);


router.get(
  "/mi-carnet",
  verifyToken,
  obtenerMiCarnet
);


// Escanear QR
router.post(
  "/escanear",
  verifyToken,
  escanearCarnet
);


module.exports = router;


const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middlewares/verifyToken");

const {
  generarCarnet,
  obtenerCarnetsPendientes,
  obtenerMiCarnet,
  escanearQr
} = require("../controllers/carnetController");

router.get(
  "/pendientes",
  verifyToken,
  obtenerCarnetsPendientes
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

router.post(
  "/escanear",
  verifyToken,
  escanearQr
);


module.exports = router;
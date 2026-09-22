const express = require("express");

const router =
  express.Router();

const verifyToken =
  require("../middlewares/verifyToken");

const {
  ejecutarAccion,
  obtenerReportes,
} =
  require("../controllers/reportesController");

// Reportar / bloquear / desbloquear
router.post(
  "/usuarios/accion",
  verifyToken,
  ejecutarAccion
);

// Obtener reportes
router.get(
  "/usuarios/reportes",
  verifyToken,
  obtenerReportes
);

module.exports = router;
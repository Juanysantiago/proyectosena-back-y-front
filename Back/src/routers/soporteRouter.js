const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/roles");

const {
  crearSoporte,
  obtenerMisSoportes,
  obtenerTodos,
  obtenerReportesRecibidos,
  responderSoporte
} = require("../controllers/soporteController");

// =======================
// APRENDIZ
// =======================

router.post(
  "/soportes",
  verifyToken,
  authorizeRoles("aprendiz"),
  crearSoporte
);

router.get(
  "/soportes/mios",
  verifyToken,
  authorizeRoles("aprendiz"),
  obtenerMisSoportes
);

// =======================
// ADMINISTRADOR
// =======================

// Soportes pendientes
router.get(
  "/soportes",
  verifyToken,
  authorizeRoles("administrador"),
  obtenerTodos
);

// Reportes recibidos (soportes resueltos)
router.get(
  "/soportes/reportes-recibidos",
  verifyToken,
  authorizeRoles("administrador"),
  obtenerReportesRecibidos
);

// Responder soporte
router.put(
  "/soportes/:id",
  verifyToken,
  authorizeRoles("administrador"),
  responderSoporte
);

module.exports = router;
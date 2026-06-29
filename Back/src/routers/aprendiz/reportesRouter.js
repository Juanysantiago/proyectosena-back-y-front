const router = require("express").Router();

const controller = require("../../controllers/aprendiz/reportesController");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/roles");

// Crear soporte (Aprendiz)
router.post(
  "/reportes",
  verifyToken,
  authorizeRoles("aprendiz"),
  controller.crearReporte
);

// Ver mis soportes (Aprendiz)
router.get(
  "/reportes/mios",
  verifyToken,
  authorizeRoles("aprendiz"),
  controller.obtenerMisReportes
);

// Ver todos los soportes (Administrador)
router.get(
  "/reportes",
  verifyToken,
  authorizeRoles("administrador"),
  controller.obtenerReportes
);

// Responder soporte (Administrador)
router.put(
  "/reportes/:id",
  verifyToken,
  authorizeRoles("administrador"),
  controller.actualizarReporte
);

module.exports = router;
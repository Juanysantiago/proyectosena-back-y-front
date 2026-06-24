const express = require("express");

const router = express.Router();

const verifyToken =
require("../middlewares/verifyToken");

const {
  obtenerNotificaciones
}
=
require("../controllers/notificacionController");

router.get(
  "/notificaciones",
  verifyToken,
  obtenerNotificaciones
);

module.exports = router;
const express = require("express");

const router = express.Router();

const verifyToken =
require("../../middlewares/verifyToken");

const {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
} = require(
  "../../controllers/aprendiz/solicitudActualizacionController"
);

const upload = require("../../middlewares/uploadSolicitud");

router.post(
  "/solicitudes-actualizacion",
  verifyToken,
  upload.fields([
  {
    name: "fotoNueva",
    maxCount: 1
  },
  {
    name: "documentos",
    maxCount: 10
  }
]),
  crearSolicitud
);

router.get(
  "/solicitudes-actualizacion",
  verifyToken,
  listarSolicitudes
);

router.put(
  "/solicitudes-actualizacion/:id/aprobar",
  verifyToken,
  aprobarSolicitud
);

router.put(
  "/solicitudes-actualizacion/:id/rechazar",
  verifyToken,
  rechazarSolicitud
);

module.exports = router;
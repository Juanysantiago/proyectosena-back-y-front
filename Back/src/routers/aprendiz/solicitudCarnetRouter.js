const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");

const upload = require("../../middlewares/upload");

const {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud
} = require(
  "../../controllers/aprendiz/solicitudCarnetController"
);

router.post(
  "/solicitudes-carnet",
  verifyToken,
  upload.fields([
    { name: "fotoAprendiz", maxCount: 1 },
    { name: "fotoVehiculo", maxCount: 1 },
    { name: "formatoDiligenciado", maxCount: 1 },
    { name: "documentosAnexos", maxCount: 1 }
  ]),
  crearSolicitud
);

router.get(
  "/solicitudes-carnet",
  verifyToken,
  listarSolicitudes
);

router.put(
  "/solicitudes-carnet/:id/aprobar",
  verifyToken,
  aprobarSolicitud
);

router.put(
  "/solicitudes-carnet/:id/rechazar",
  verifyToken,
  rechazarSolicitud
);

module.exports = router;
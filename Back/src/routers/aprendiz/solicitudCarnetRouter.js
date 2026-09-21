const express = require("express");

const router = express.Router();

const verifyToken =
  require("../../middlewares/verifyToken");

const upload =
  require("../../middlewares/upload");

const {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} = require(
  "../../controllers/aprendiz/solicitudCarnetController"
);

// ==========================================
// CREAR SOLICITUD
// ==========================================

router.post(
  "/solicitudes-carnet",

  verifyToken,

  upload.fields([
    {
      name: "fotoAprendiz",
      maxCount: 1,
    },

    {
      name: "fotoVehiculo",
      maxCount: 1,
    },

    {
      name: "fotoCedula",
      maxCount: 1,
    },

    {
      name: "tarjetaPropiedad",
      maxCount: 1,
    },

    {
      name: "soat",
      maxCount: 1,
    },

    {
      name: "tecnomecanica",
      maxCount: 1,
    },

    {
      name: "fotoPlacaSerial",
      maxCount: 1,
    },
  ]),

  crearSolicitud
);

// ==========================================
// LISTAR SOLICITUDES
// ==========================================

router.get(
  "/solicitudes-carnet",
  verifyToken,
  listarSolicitudes
);

// ==========================================
// APROBAR
// ==========================================

router.put(
  "/solicitudes-carnet/:id/aprobar",
  verifyToken,
  aprobarSolicitud
);

// ==========================================
// RECHAZAR
// ==========================================

router.put(
  "/solicitudes-carnet/:id/rechazar",
  verifyToken,
  rechazarSolicitud
);

module.exports = router;
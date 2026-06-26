const router = require("express").Router();

const controller = require("../../controllers/aprendiz/reportesController");

// agrega aquí tu middleware de autenticación si ya lo tienes
// const verifyToken = require("../../middlewares/verifyToken");

router.post("/reportes", controller.crearReporte);

router.get("/reportes", controller.obtenerReportes);

router.put("/reportes/:id", controller.marcarLeido);

module.exports = router;
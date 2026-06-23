const express = require("express");
const router = express.Router();

const {
  crearCentro,
  listarCentros,
  obtenerCentro,
  actualizarCentro,
  eliminarCentro
} = require("../controllers/centroFormacionController");

router.post("/centros", crearCentro);

router.get("/centros", listarCentros);

router.get("/centros/:id", obtenerCentro);

router.put("/centros/:id", actualizarCentro);

router.delete("/centros/:id", eliminarCentro);

module.exports = router;
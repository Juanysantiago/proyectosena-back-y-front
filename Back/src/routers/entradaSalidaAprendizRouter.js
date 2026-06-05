const express = require("express");
const {
  createRegistro,
  getRegistros,
  updateRegistro,
  deleteRegistro,
} = require("../controllers/entradaSalidaAprendizController");

const router = express.Router();

// crear entrada
router.post("/entrada-salida-aprendiz", createRegistro);

// listar
router.get("/entrada-salida-aprendiz", getRegistros);

// actualizar (salida o edición)
router.patch("/entrada-salida-aprendiz/:id", updateRegistro);

// eliminar
router.delete("/entrada-salida-aprendiz/:id", deleteRegistro);

module.exports = router;
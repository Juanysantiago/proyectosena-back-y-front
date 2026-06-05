const express = require("express");
const {
  createRegistro,
  getRegistros,
} = require("../controllers/entradaSalidaAprendizController");

const router = express.Router();

// crear entrada/salida
router.post("/entrada-salida-aprendiz", createRegistro);

// listar registros
router.get("/entrada-salida-aprendiz", getRegistros);

module.exports = router;
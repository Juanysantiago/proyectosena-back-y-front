const express = require("express");
const {
  createJornada,
  getJornadas,
} = require("../controllers/jornadaController");

const router = express.Router();

// crear jornada
router.post("/jornada", createJornada);

// listar jornadas
router.get("/jornada", getJornadas);

module.exports = router;
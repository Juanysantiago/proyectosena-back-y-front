const express = require("express");
const {
  createTipoDocumento,
  getTipoDocumentos,
} = require("../controllers/tipoDocumentoController");

const router = express.Router();

// crear
router.post("/tipo-documento", createTipoDocumento);

// listar
router.get("/tipo-documento", getTipoDocumentos);

module.exports = router;
const express = require("express");

const {
  createTipoDocumento,
  getTipoDocumentos,
  getTipoDocumentoById,
  updateTipoDocumento,
  deleteTipoDocumento,
} = require("../controllers/tipoDocumentoController");

const router = express.Router();

router.post("/tipo-documento", createTipoDocumento);

router.get("/tipo-documento", getTipoDocumentos);

router.get("/tipo-documento/:id", getTipoDocumentoById);

router.put("/tipo-documento/:id", updateTipoDocumento);

router.delete("/tipo-documento/:id", deleteTipoDocumento);

module.exports = router;
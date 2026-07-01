const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const { ejecutarAccion } = require("../controllers/reportesController");

router.post("/usuarios/accion", verifyToken, ejecutarAccion);

module.exports = router;
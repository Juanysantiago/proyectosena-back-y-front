const express = require("express");
const router = express.Router();

const {
  getConfigGr,
  createConfigGr,
  updateConfigGr,
  deleteConfigGr
} = require("../controllers/configGrController");

// IMPORTANTE: aquí va SOLO el recurso
router.get("/config-gr", getConfigGr);
router.post("/config-gr", createConfigGr);
router.put("/config-gr/:id", updateConfigGr);
router.delete("/config-gr/:id", deleteConfigGr);

module.exports = router;
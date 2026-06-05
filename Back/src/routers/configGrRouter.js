const express = require("express");
const {
  createConfigGr,
  getConfigGr,
} = require("../controllers/configGrController");

const router = express.Router();

// crear config
router.post("/config-gr", createConfigGr);

// listar config
router.get("/config-gr", getConfigGr);

module.exports = router;
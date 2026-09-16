const express = require("express");

const router = express.Router();

const {
  register,
  login,
  recuperarPassword,
  verificarPin,
  cambiarPassword,
  reenviarPin,
  obtenerMiPerfil,
  logout,
} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");

// ==========================================
// REGISTRO
// ==========================================

router.post(
  "/register",
  register
);

// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  login
);

// ==========================================
// RECUPERAR CONTRASEÑA
// ==========================================

router.post(
  "/recuperar-password",
  recuperarPassword
);

// ==========================================
// VERIFICAR PIN
// ==========================================

router.post(
  "/verificar-pin",
  verificarPin
);

// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================

router.post(
  "/cambiar-password",
  cambiarPassword
);

// ==========================================
// REENVIAR PIN
// ==========================================

router.post(
  "/reenviar-pin",
  reenviarPin
);

// ==========================================
// VERIFICAR SESIÓN
// ==========================================

router.get(
  "/me",
  verifyToken,
  obtenerMiPerfil
);

// ==========================================
// CERRAR SESIÓN
// ==========================================

router.post(
  "/logout",
  logout
);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCarnet,
  recuperarPassword,
  verificarPin,
  reenviarPin,
  cambiarPassword,
  obtenerMiPerfil,
  logout,
} = require("../controllers/authController");

// ==========================================
// MIDDLEWARE
// ==========================================

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

router.post(
  "/verificar-pin",
  verificarPin
);

router.post(
  "/reenviar-pin",
  reenviarPin
);

router.post(
  "/cambiar-password",
  cambiarPassword
);

// ==========================================
// USUARIOS
// ==========================================

router.get(
  "/users",
  getUsers
);

router.get(
  "/users/:id",
  getUserById
);

router.put(
  "/users/:id",
  updateUser
);

router.delete(
  "/users/:id",
  deleteUser
);

// ==========================================
// MI PERFIL
// ==========================================
// IMPORTANTE:
// Esta ruta necesita el token que crea el login.

router.get(
  "/me",
  verifyToken,
  obtenerMiPerfil
);

// ==========================================
// CARNET
// ==========================================

router.get(
  "/users/:id/carnet",
  getCarnet
);

// ==========================================
// LOGOUT
// ==========================================

router.post(
  "/logout",
  logout
);

module.exports = router;
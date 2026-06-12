const express = require("express");

const {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Perfil usando token
router.get("/profile", verifyToken, getProfile);

// Rutas de usuarios
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
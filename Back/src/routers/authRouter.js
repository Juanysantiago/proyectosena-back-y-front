const express = require("express");

const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/authController");

const router = express.Router();

// Registro
router.post("/register", register);

// Login
router.post("/login", login);


// Usuarios
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
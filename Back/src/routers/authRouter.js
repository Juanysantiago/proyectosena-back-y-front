const express = require("express");

const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/roles");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/users",
  verifyToken,
  authorizeRoles("administrador"),
  getUsers
);

router.get(
  "/users/:id",
  verifyToken,
  getUserById
);

router.put(
  "/users/:id",
  verifyToken,
  updateUser
);

router.delete(
  "/users/:id",
  verifyToken,
  authorizeRoles("administrador"),
  deleteUser
);

module.exports = router;
const express = require("express");

const {
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
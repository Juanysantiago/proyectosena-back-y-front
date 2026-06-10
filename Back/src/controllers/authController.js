const User = require("../models/User");

// POST - Registrar usuario
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      documento,
      ficha,
      nombres,
      apellidos,
      rol
    } = req.body;

    if (
      !email ||
      !password ||
      !documento ||
      !nombres ||
      !apellidos ||
      !rol
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const userExists = await User.findOne({
      where: { email }
    });

    if (userExists) {
      return res.status(409).json({
        message: "El usuario ya existe"
      });
    }

    const newUser = await User.create({
      email,
      password,
      documento,
      ficha: rol === "aprendiz" ? ficha : null,
      nombres,
      apellidos,
      rol
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// GET - Todos los usuarios
const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// GET - Usuario por ID
const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado"
    });
  }

  res.json(user);
};

// PUT - Actualizar usuario
const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado"
    });
  }

  await user.update(req.body);

  res.json({
    message: "Usuario actualizado",
    user
  });
};

// DELETE - Eliminar usuario
const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado"
    });
  }

  await user.destroy();

  res.json({
    message: "Usuario eliminado"
  });
};

module.exports = {
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
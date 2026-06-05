const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y password son obligatorios",
      });
    }

    // validar si ya existe el usuario
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).json({
        message: "El usuario ya existe",
      });
    }

    // crear usuario
    const newUser = await User.create({
      email,
      password,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

module.exports = {
  register,
};
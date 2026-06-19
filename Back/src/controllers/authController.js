const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST - Registrar usuario
const register = async (req, res) => {
  try {
    const {
      email,
    password,
    documento,
    tipoDocumento,
    nombres,
    apellidos,
    ficha,
    celular,
    rol
    } = req.body;

    if (
      !email ||
      !password ||
      !documento ||
      !tipoDocumento ||
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      documento,
      tipoDocumento,
      nombres,
      apellidos,
      ficha,
      celular,
      rol
    });

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        rol: newUser.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        documento: newUser.documento,
        tipoDocumento: newUser.tipoDocumento,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        ficha: newUser.ficha,
        celular: newUser.celular,
        rol: newUser.rol
      }
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// POST - Login
const login = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password || !rol) {
      return res.status(400).json({
        message: "Email, contraseña y rol son obligatorios"
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    if (user.rol !== rol) {
      return res.status(401).json({
        message: "Rol incorrecto"
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    return res.status(200).json({
      message: "Login exitoso",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        documento: user.documento,
        tipoDocumento: user.tipoDocumento,
        nombres: user.nombres,
        apellidos: user.apellidos,
        ficha: user.ficha,
        celular: user.celular,
        rol: user.rol
      }
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Debe ingresar un correo"
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "No existe un usuario con ese correo"
      });
    }

    const pin = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.pinRecuperacion = pin;
    user.fechaPin = new Date();

    await user.save();

    console.log(
      `PIN de recuperación para ${email}: ${pin}`
    );

    return res.status(200).json({
      message: "PIN enviado correctamente"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};


// GET - Perfil usando el token
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// GET - Todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// GET - Usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// PUT - Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const { password, ...updateData } = req.body;

    await user.update(updateData);

    return res.status(200).json({
      message: "Usuario actualizado",
      user
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// DELETE - Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "Usuario eliminado"
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

const verificarPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

   console.log("PIN BD:", user.pinRecuperacion);
console.log("PIN recibido:", pin);

if (String(user.pinRecuperacion) !== String(pin)) {
  return res.status(400).json({
    message: "Código incorrecto"
  });
}

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    return res.status(200).json({
      message: "Código correcto",
      accessToken,
      user
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en servidor"
    });
  }
};


const reenviarPin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const pin = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.pinRecuperacion = pin;
    user.fechaPin = new Date();

    await user.save();

    console.log(
      `Nuevo PIN para ${email}: ${pin}`
    );

    return res.status(200).json({
      message: "Código reenviado"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error en servidor"
    });
  }
};
module.exports = {
  register,
  login,
  recuperarPassword,
  verificarPin,
  reenviarPin,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
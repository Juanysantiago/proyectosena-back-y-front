const User = require("../models/User");

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

   if (!["aprendiz", "guarda", "administrador"].includes(rol)) {
  return res.status(400).json({
    message: "Rol inválido. Debe ser 'aprendiz', 'guarda' o 'administrador'"
  });
}

    if (!["CC", "TI", "CE", "PAS"].includes(tipoDocumento)) {
      return res.status(400).json({
        message: "Tipo de documento inválido. Debe ser CC, TI, CE o PAS"
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
      tipoDocumento,
      nombres,
      apellidos,
      rol
    });

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      documento: newUser.documento,
      tipoDocumento: newUser.tipoDocumento,
      nombres: newUser.nombres,
      apellidos: newUser.apellidos,
      rol: newUser.rol
    };

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: userResponse
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

    if (user.password !== password) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    if (user.rol !== rol) {
      return res.status(401).json({
        message: "Rol incorrecto"
      });
    }

    return res.status(200).json({
      message: "Login exitoso",
      accessToken: "token-demo",
      user: {
        id: user.id,
        email: user.email,
        documento: user.documento,
        tipoDocumento: user.tipoDocumento,
        nombres: user.nombres,
        apellidos: user.apellidos,
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

// GET - Todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
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

    res.json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
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

    const userResponse = {
      id: user.id,
      email: user.email,
      documento: user.documento,
      tipoDocumento: user.tipoDocumento,
      nombres: user.nombres,
      apellidos: user.apellidos,
      rol: user.rol
    };

    res.json({
      message: "Usuario actualizado",
      user: userResponse
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
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

    res.json({
      message: "Usuario eliminado"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
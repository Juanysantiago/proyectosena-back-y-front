const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

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
  centroFormacionId,
  fechaVinculacion,
  fechaFinalizacion,
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

    const qrCode = uuidv4();

    const newUser = await User.create({
  email,
  password: hashedPassword,
  documento,
  tipoDocumento,
  nombres,
  apellidos,
  ficha,
  celular,
  centroFormacionId,
  fechaVinculacion,
  fechaFinalizacion,
  rol,
  qrCode
});

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        rol: newUser.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
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
  centroFormacionId: newUser.centroFormacionId,
  fechaVinculacion: newUser.fechaVinculacion,
  fechaFinalizacion: newUser.fechaFinalizacion,
  rol: newUser.rol,
  qrCode: newUser.qrCode
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
      where: { email },
      include: [
        {
          model: CentroFormacion,
          as: "centroFormacion"
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

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
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      accessToken,
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en el servidor"
    });
  }
};

// GET CARNET
const getCarnet = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const qrImage = await QRCode.toDataURL(user.qrCode);

    return res.json({
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      documento: user.documento,
      ficha: user.ficha,
      rol: user.rol,
      qrImage
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error generando carnet"
    });
  }
};

// RECUPERAR PIN
const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "No existe usuario"
      });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    user.pinRecuperacion = pin;
    user.fechaPin = new Date();

    await user.save();

    console.log(`PIN: ${pin}`);

    return res.json({ message: "PIN enviado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en servidor"
    });
  }
};

// VERIFICAR PIN
const verificarPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    if (String(user.pinRecuperacion) !== String(pin)) {
      return res.status(400).json({
        message: "Código incorrecto"
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Código correcto",
      accessToken: token,
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en servidor"
    });
  }
};

// REENVIAR PIN
const reenviarPin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    user.pinRecuperacion = pin;
    user.fechaPin = new Date();

    await user.save();

    console.log(`Nuevo PIN: ${pin}`);

    return res.json({ message: "PIN reenviado" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en servidor"
    });
  }
};

// OBTENER TODOS LOS USUARIOS
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "pinRecuperacion", "fechaPin"]
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error obteniendo usuarios"
    });
  }
};

// OBTENER USUARIO POR ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password", "pinRecuperacion", "fechaPin"]
      }
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
      message: "Error obteniendo usuario"
    });
  }
};

// ACTUALIZAR USUARIO
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    await user.update(req.body);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error actualizando usuario"
    });
  }
};

// ELIMINAR USUARIO
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
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error eliminando usuario"
    });
  }
};


module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCarnet,
  recuperarPassword,
  verificarPin,
  reenviarPin
};
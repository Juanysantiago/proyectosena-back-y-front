const { Op } = require("sequelize");
const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

// ==========================================
// VALIDACIONES
// ==========================================

const esTextoValido = (valor) => {
  return (
    typeof valor === "string" &&
    valor.trim().length > 0
  );
};

const esEmailValido = (email) => {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    )
  );
};

const esDocumentoValido = (documento) => {
  return (
    typeof documento === "string" &&
    /^\d{6,15}$/.test(documento.trim())
  );
};

const esCelularValido = (celular) => {
  return (
    typeof celular === "string" &&
    /^3\d{9}$/.test(celular.trim())
  );
};

const esPasswordValida = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 8
  );
};

const esRolValido = (rol) => {
  return [
    "administrador",
    "guarda",
    "aprendiz",
  ].includes(rol);
};

const esFechaValida = (fecha) => {
  if (!fecha) {
    return true;
  }

  const fechaObj = new Date(fecha);

  return !isNaN(fechaObj.getTime());
};

const esIdValido = (id) => {
  return /^\d+$/.test(String(id));
};

// ==========================================
// REGISTRAR USUARIO
// ==========================================

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
      rol,
    } = req.body;

    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico no es válido",
      });
    }

    if (!esPasswordValida(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres",
      });
    }

    if (!esDocumentoValido(documento)) {
      return res.status(400).json({
        message:
          "El documento debe contener entre 6 y 15 números",
      });
    }

    if (!esTextoValido(tipoDocumento)) {
      return res.status(400).json({
        message:
          "El tipo de documento es obligatorio",
      });
    }

    if (!esTextoValido(nombres)) {
      return res.status(400).json({
        message:
          "Los nombres son obligatorios",
      });
    }

    if (!esTextoValido(apellidos)) {
      return res.status(400).json({
        message:
          "Los apellidos son obligatorios",
      });
    }

    if (!esRolValido(rol)) {
      return res.status(400).json({
        message:
          "El rol seleccionado no es válido",
      });
    }

    if (
      celular !== undefined &&
      celular !== null &&
      celular !== "" &&
      !esCelularValido(String(celular))
    ) {
      return res.status(400).json({
        message:
          "El celular debe tener 10 números y comenzar por 3",
      });
    }

    if (!esFechaValida(fechaVinculacion)) {
      return res.status(400).json({
        message:
          "La fecha de vinculación no es válida",
      });
    }

    if (!esFechaValida(fechaFinalizacion)) {
      return res.status(400).json({
        message:
          "La fecha de finalización no es válida",
      });
    }

    if (
      fechaVinculacion &&
      fechaFinalizacion &&
      new Date(fechaFinalizacion) <
        new Date(fechaVinculacion)
    ) {
      return res.status(400).json({
        message:
          "La fecha de finalización no puede ser anterior a la fecha de vinculación",
      });
    }

    // ==========================================
    // CENTRO DE FORMACIÓN
    // ==========================================

    if (
      centroFormacionId !== undefined &&
      centroFormacionId !== null &&
      centroFormacionId !== ""
    ) {
      if (!esIdValido(centroFormacionId)) {
        return res.status(400).json({
          message:
            "El centro de formación no es válido",
        });
      }

      const centro =
        await CentroFormacion.findByPk(
          centroFormacionId
        );

      if (!centro) {
        return res.status(404).json({
          message:
            "El centro de formación no existe",
        });
      }
    }

    // ==========================================
    // NORMALIZAR
    // ==========================================

    const emailNormalizado =
      email.trim().toLowerCase();

    const documentoNormalizado =
      String(documento).trim();

    const nombresNormalizados =
      nombres.trim();

    const apellidosNormalizados =
      apellidos.trim();

    const tipoDocumentoNormalizado =
      tipoDocumento.trim();

    const celularNormalizado =
      celular
        ? String(celular).trim()
        : null;

    if (
      nombresNormalizados.length < 2 ||
      nombresNormalizados.length > 100
    ) {
      return res.status(400).json({
        message:
          "Los nombres deben tener entre 2 y 100 caracteres",
      });
    }

    if (
      apellidosNormalizados.length < 2 ||
      apellidosNormalizados.length > 100
    ) {
      return res.status(400).json({
        message:
          "Los apellidos deben tener entre 2 y 100 caracteres",
      });
    }

    // ==========================================
    // USUARIO EXISTENTE
    // ==========================================

    const userExists =
      await User.findOne({
        where: {
          [Op.or]: [
            {
              email:
                emailNormalizado,
            },
            {
              documento:
                documentoNormalizado,
            },
          ],
        },
      });

    if (userExists) {
      if (
        userExists.email.toLowerCase() ===
        emailNormalizado
      ) {
        return res.status(409).json({
          message:
            "El correo electrónico ya está registrado",
        });
      }

      if (
        userExists.documento ===
        documentoNormalizado
      ) {
        return res.status(409).json({
          message:
            "El documento ya está registrado",
        });
      }
    }

    // ==========================================
    // PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==========================================
    // QR
    // ==========================================

    const qrCode = uuidv4();

    // ==========================================
    // CREAR USUARIO
    // ==========================================

    const newUser =
      await User.create({
        email: emailNormalizado,
        password: hashedPassword,
        documento: documentoNormalizado,
        tipoDocumento:
          tipoDocumentoNormalizado,
        nombres:
          nombresNormalizados,
        apellidos:
          apellidosNormalizados,
        ficha: ficha
          ? String(ficha).trim()
          : null,
        celular:
          celularNormalizado,
        centroFormacionId:
          centroFormacionId || null,
        fechaVinculacion:
          fechaVinculacion || null,
        fechaFinalizacion:
          fechaFinalizacion || null,
        rol,
        qrCode,
        estado: "activo",
      });

    return res.status(201).json({
      message:
        "Usuario registrado correctamente",

      user: {
        id: newUser.id,
        email: newUser.email,
        documento: newUser.documento,
        tipoDocumento:
          newUser.tipoDocumento,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        ficha: newUser.ficha,
        celular: newUser.celular,
        centroFormacionId:
          newUser.centroFormacionId,
        fechaVinculacion:
          newUser.fechaVinculacion,
        fechaFinalizacion:
          newUser.fechaFinalizacion,
        rol: newUser.rol,
        qrCode: newUser.qrCode,
        estado: newUser.estado,
      },
    });
  } catch (error) {
    console.error(
      "ERROR REGISTRANDO USUARIO:",
      error
    );

    if (
      error.name ===
      "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({
        message:
          "El correo o documento ya se encuentra registrado",
      });
    }

    return res.status(500).json({
      message:
        "Error en el servidor",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
      rol,
    } = req.body;

    console.log(
      "========== LOGIN =========="
    );

    console.log(
      "Email recibido:",
      email
    );

    console.log(
      "Rol recibido:",
      rol
    );

    // ==========================================
    // VALIDAR EMAIL
    // ==========================================

    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "Ingrese un correo electrónico válido",
      });
    }

    // ==========================================
    // VALIDAR PASSWORD
    // ==========================================

    if (!esTextoValido(password)) {
      return res.status(400).json({
        message:
          "La contraseña es obligatoria",
      });
    }

    // ==========================================
    // VALIDAR ROL
    // ==========================================

    if (!esRolValido(rol)) {
      return res.status(400).json({
        message:
          "El rol seleccionado no es válido",
      });
    }

    // ==========================================
    // NORMALIZAR EMAIL
    // ==========================================

    const emailNormalizado =
      email.trim().toLowerCase();

    // ==========================================
    // BUSCAR USUARIO
    // ==========================================

    const user =
      await User.findOne({
        where: {
          email:
            emailNormalizado,
        },

        include: [
          {
            model: CentroFormacion,
            as: "centroFormacion",
            required: false,
          },
        ],
      });

    if (!user) {
      console.log(
        "Usuario no encontrado"
      );

      return res.status(404).json({
        message:
          "Usuario no encontrado",
      });
    }

    console.log(
      "Usuario encontrado:",
      user.id
    );

    console.log(
      "Rol BD:",
      user.rol
    );

    console.log(
      "Estado BD:",
      user.estado
    );

    // ==========================================
    // COMPROBAR PASSWORD
    // ==========================================

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      console.log(
        "Contraseña incorrecta"
      );

      return res.status(401).json({
        message:
          "Contraseña incorrecta",
      });
    }

    // ==========================================
    // COMPROBAR ROL
    // ==========================================

    if (user.rol !== rol) {
      console.log(
        "Rol incorrecto"
      );

      return res.status(401).json({
        message:
          "Rol incorrecto",
      });
    }

    // ==========================================
    // COMPROBAR ESTADO
    // ==========================================

    if (
      user.estado ===
      "bloqueado"
    ) {
      return res.status(403).json({
        message:
          "Usuario bloqueado. Comuníquese al soporte.",
      });
    }

    // ==========================================
    // JWT
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET no está configurado"
      );

      return res.status(500).json({
        message:
          "JWT_SECRET no está configurado en el servidor",
      });
    }

    const accessToken =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          rol: user.rol,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "24h",
        }
      );

    // ==========================================
    // COOKIE
    // ==========================================

    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge:
          24 * 60 * 60 * 1000,
      }
    );

    // ==========================================
    // RESPUESTA
    // ==========================================

    console.log(
      "LOGIN EXITOSO"
    );

    return res.status(200).json({
      message:
        "Login exitoso",

      user: {
        id: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        rol: user.rol,
        documento: user.documento,
        ficha: user.ficha,
        centroFormacionId:
          user.centroFormacionId,
        estado: user.estado,
      },
    });
  } catch (error) {
    console.error(
      "ERROR EN LOGIN:",
      error
    );

    return res.status(500).json({
      message:
        "Error en el servidor",
      error: error.message,
    });
  }
};

// ==========================================
// GET CARNET
// ==========================================

const getCarnet = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (!esIdValido(id)) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido",
      });
    }

    const user =
      await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado",
      });
    }

    if (!user.qrCode) {
      return res.status(404).json({
        message:
          "El usuario no tiene un código QR",
      });
    }

    const qrImage =
      await QRCode.toDataURL(
        user.qrCode
      );

    return res.json({
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      documento: user.documento,
      ficha: user.ficha,
      rol: user.rol,
      qrImage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Error generando carnet",
    });
  }
};

// ==========================================
// RECUPERAR PASSWORD
// ==========================================

const recuperarPassword =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      if (!esEmailValido(email)) {
        return res.status(400).json({
          message:
            "Ingrese un correo electrónico válido",
        });
      }

      const emailNormalizado =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          where: {
            email:
              emailNormalizado,
          },
        });

      if (!user) {
        return res.status(404).json({
          message:
            "No existe usuario con ese correo",
        });
      }

      const pin =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      user.pinRecuperacion =
        pin;

      user.fechaPin =
        new Date();

      await user.save();

      console.log(
        `PIN: ${pin}`
      );

      return res.json({
        message:
          "PIN enviado",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error en servidor",
      });
    }
  };

// ==========================================
// VERIFICAR PIN
// ==========================================

const verificarPin =
  async (req, res) => {
    try {
      const {
        email,
        pin,
      } = req.body;

      if (!esEmailValido(email)) {
        return res.status(400).json({
          message:
            "El correo electrónico no es válido",
        });
      }

      if (
        typeof pin !== "string" ||
        !/^\d{6}$/.test(pin)
      ) {
        return res.status(400).json({
          message:
            "El PIN debe contener exactamente 6 números",
        });
      }

      const emailNormalizado =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          where: {
            email:
              emailNormalizado,
          },
        });

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      if (!user.pinRecuperacion) {
        return res.status(400).json({
          message:
            "No existe un PIN activo. Solicite uno nuevo.",
        });
      }

      if (!user.fechaPin) {
        return res.status(400).json({
          message:
            "El PIN no es válido. Solicite uno nuevo.",
        });
      }

      const ahora =
        new Date();

      const fechaPin =
        new Date(
          user.fechaPin
        );

      const diferencia =
        ahora.getTime() -
        fechaPin.getTime();

      const diezMinutos =
        10 * 60 * 1000;

      if (
        diferencia >
        diezMinutos
      ) {
        user.pinRecuperacion =
          null;

        user.fechaPin =
          null;

        await user.save();

        return res.status(400).json({
          message:
            "El PIN ha expirado. Solicite uno nuevo.",
        });
      }

      if (
        String(
          user.pinRecuperacion
        ) !== String(pin)
      ) {
        return res.status(400).json({
          message:
            "Código incorrecto",
        });
      }

      const resetToken =
        jwt.sign(
          {
            id: user.id,
            email: user.email,
            tipo: "recuperacion",
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "10m",
          }
        );

      user.pinRecuperacion =
        null;

      user.fechaPin =
        null;

      await user.save();

      return res.status(200).json({
        message:
          "Código correcto",
        resetToken,
      });
    } catch (error) {
      console.error(
        "Error verificando PIN:",
        error
      );

      return res.status(500).json({
        message:
          "Error en servidor",
      });
    }
  };

// ==========================================
// CAMBIAR PASSWORD
// ==========================================

const cambiarPassword =
  async (req, res) => {
    try {
      const {
        resetToken,
        password,
      } = req.body;

      if (!resetToken) {
        return res.status(401).json({
          message:
            "Token de recuperación requerido",
        });
      }

      let datosToken;

      try {
        datosToken =
          jwt.verify(
            resetToken,
            process.env.JWT_SECRET
          );
      } catch (error) {
        return res.status(401).json({
          message:
            "El código de recuperación ha expirado",
        });
      }

      if (
        datosToken.tipo !==
        "recuperacion"
      ) {
        return res.status(401).json({
          message:
            "Token de recuperación no válido",
        });
      }

      if (!esPasswordValida(password)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres",
        });
      }

      const user =
        await User.findByPk(
          datosToken.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      user.password =
        await bcrypt.hash(
          password,
          10
        );

      await user.save();

      return res.status(200).json({
        message:
          "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error(
        "Error cambiando contraseña:",
        error
      );

      return res.status(500).json({
        message:
          "Error actualizando contraseña",
      });
    }
  };

// ==========================================
// REENVIAR PIN
// ==========================================

const reenviarPin =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      if (!esEmailValido(email)) {
        return res.status(400).json({
          message:
            "El correo electrónico no es válido",
        });
      }

      const emailNormalizado =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          where: {
            email:
              emailNormalizado,
          },
        });

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      const pin =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      user.pinRecuperacion =
        pin;

      user.fechaPin =
        new Date();

      await user.save();

      console.log(
        `Nuevo PIN: ${pin}`
      );

      return res.json({
        message:
          "PIN reenviado",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error en servidor",
      });
    }
  };

// ==========================================
// OBTENER TODOS LOS USUARIOS
// BÚSQUEDA + PAGINACIÓN
// ==========================================

const getUsers = async (
  req,
  res
) => {
  try {
    const nombre =
      req.query.nombre || "";

    const page =
      parseInt(
        req.query.page
      ) || 1;

    const limit =
      parseInt(
        req.query.limit
      ) || 10;

    const pagina =
      Math.max(page, 1);

    const limite =
      Math.min(
        Math.max(limit, 1),
        100
      );

    const offset =
      (pagina - 1) *
      limite;

    const busqueda =
      String(nombre).trim();

    let where = {};

    if (busqueda !== "") {
      where = {
        [Op.or]: [
          {
            nombres: {
              [Op.like]:
                `%${busqueda}%`,
            },
          },
          {
            apellidos: {
              [Op.like]:
                `%${busqueda}%`,
            },
          },
          {
            documento: {
              [Op.like]:
                `%${busqueda}%`,
            },
          },
        ],
      };
    }

    const resultado =
      await User.findAndCountAll({
        where,

        attributes: {
          exclude: [
            "password",
            "pinRecuperacion",
            "fechaPin",
          ],
        },

        include: [
          {
            model: CentroFormacion,
            as: "centroFormacion",
            attributes: [
              "id",
              "nombre",
            ],
            required: false,
          },
        ],

        order: [
          ["id", "DESC"],
        ],

        limit: limite,

        offset: offset,

        distinct: true,
      });

    const total =
      resultado.count;

    const totalPages =
      Math.ceil(
        total / limite
      );

    return res.status(200).json({
      success: true,
      data: resultado.rows,
      total,
      totalPages,
      currentPage: pagina,
      limit: limite,
    });
  } catch (error) {
    console.error(
      "ERROR OBTENIENDO USUARIOS:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error obteniendo usuarios",
      error:
        error.message,
    });
  }
};

// ==========================================
// OBTENER USUARIO POR ID
// ==========================================

const getUserById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          message:
            "El ID del usuario no es válido",
        });
      }

      const user =
        await User.findByPk(
          id,
          {
            attributes: {
              exclude: [
                "password",
                "pinRecuperacion",
                "fechaPin",
              ],
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      return res.status(200).json(
        user
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error obteniendo usuario",
      });
    }
  };

// ==========================================
// ACTUALIZAR USUARIO
// ==========================================

const updateUser =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          message:
            "El ID del usuario no es válido",
        });
      }

      const user =
        await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      const camposPermitidos = [
        "nombres",
        "apellidos",
        "email",
        "documento",
        "tipoDocumento",
        "ficha",
        "celular",
        "centroFormacionId",
        "fechaVinculacion",
        "fechaFinalizacion",
        "foto",
      ];

      const datosActualizados =
        {};

      for (
        const campo of camposPermitidos
      ) {
        if (
          req.body[campo] !==
          undefined
        ) {
          datosActualizados[
            campo
          ] =
            req.body[campo];
        }
      }

      if (
        Object.keys(
          datosActualizados
        ).length === 0 &&
        req.body.password ===
          undefined
      ) {
        return res.status(400).json({
          message:
            "No hay datos válidos para actualizar",
        });
      }

      if (
        datosActualizados.nombres !==
        undefined
      ) {
        if (
          !esTextoValido(
            datosActualizados.nombres
          )
        ) {
          return res.status(400).json({
            message:
              "Los nombres son obligatorios",
          });
        }

        datosActualizados.nombres =
          datosActualizados.nombres.trim();
      }

      if (
        datosActualizados.apellidos !==
        undefined
      ) {
        if (
          !esTextoValido(
            datosActualizados.apellidos
          )
        ) {
          return res.status(400).json({
            message:
              "Los apellidos son obligatorios",
          });
        }

        datosActualizados.apellidos =
          datosActualizados.apellidos.trim();
      }

      if (
        datosActualizados.email !==
        undefined
      ) {
        if (
          !esEmailValido(
            datosActualizados.email
          )
        ) {
          return res.status(400).json({
            message:
              "El correo electrónico no es válido",
          });
        }

        datosActualizados.email =
          datosActualizados.email
            .trim()
            .toLowerCase();

        const emailExiste =
          await User.findOne({
            where: {
              email:
                datosActualizados.email,

              id: {
                [Op.ne]: id,
              },
            },
          });

        if (emailExiste) {
          return res.status(409).json({
            message:
              "El correo electrónico ya está registrado",
          });
        }
      }

      if (
        datosActualizados.documento !==
        undefined
      ) {
        if (
          !esDocumentoValido(
            String(
              datosActualizados.documento
            )
          )
        ) {
          return res.status(400).json({
            message:
              "El documento debe contener entre 6 y 15 números",
          });
        }

        datosActualizados.documento =
          String(
            datosActualizados.documento
          ).trim();

        const documentoExiste =
          await User.findOne({
            where: {
              documento:
                datosActualizados.documento,

              id: {
                [Op.ne]: id,
              },
            },
          });

        if (documentoExiste) {
          return res.status(409).json({
            message:
              "El documento ya está registrado",
          });
        }
      }

      if (
        datosActualizados.celular !==
          undefined &&
        datosActualizados.celular !==
          null &&
        datosActualizados.celular !==
          ""
      ) {
        if (
          !esCelularValido(
            String(
              datosActualizados.celular
            )
          )
        ) {
          return res.status(400).json({
            message:
              "El celular debe tener 10 números y comenzar por 3",
          });
        }

        datosActualizados.celular =
          String(
            datosActualizados.celular
          ).trim();
      }

      if (
        datosActualizados.centroFormacionId !==
          undefined &&
        datosActualizados.centroFormacionId !==
          null
      ) {
        const centro =
          await CentroFormacion.findByPk(
            datosActualizados.centroFormacionId
          );

        if (!centro) {
          return res.status(404).json({
            message:
              "El centro de formación no existe",
          });
        }
      }

      const fechaVinculacion =
        datosActualizados.fechaVinculacion ??
        user.fechaVinculacion;

      const fechaFinalizacion =
        datosActualizados.fechaFinalizacion ??
        user.fechaFinalizacion;

      if (
        fechaVinculacion &&
        fechaFinalizacion &&
        new Date(
          fechaFinalizacion
        ) <
          new Date(
            fechaVinculacion
          )
      ) {
        return res.status(400).json({
          message:
            "La fecha de finalización no puede ser anterior a la fecha de vinculación",
        });
      }

      if (
        req.body.password !==
        undefined
      ) {
        if (
          !esPasswordValida(
            req.body.password
          )
        ) {
          return res.status(400).json({
            message:
              "La contraseña debe tener mínimo 8 caracteres",
          });
        }

        datosActualizados.password =
          await bcrypt.hash(
            req.body.password,
            10
          );
      }

      await user.update(
        datosActualizados
      );

      const userResponse =
        user.toJSON();

      delete userResponse.password;
      delete userResponse.pinRecuperacion;
      delete userResponse.fechaPin;

      return res.status(200).json({
        message:
          "Usuario actualizado correctamente",
        user:
          userResponse,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error actualizando usuario",
        error:
          error.message,
      });
    }
  };

// ==========================================
// ELIMINAR USUARIO
// ==========================================

const deleteUser =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          message:
            "El ID del usuario no es válido",
        });
      }

      const user =
        await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      await user.destroy();

      return res.status(200).json({
        message:
          "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error eliminando usuario",
      });
    }
  };

// ==========================================
// MI PERFIL
// ==========================================

const obtenerMiPerfil =
  async (req, res) => {
    try {
      if (
        !req.user ||
        !req.user.id
      ) {
        return res.status(401).json({
          message:
            "Usuario no autenticado",
        });
      }

      const user =
        await User.findByPk(
          req.user.id,
          {
            attributes: {
              exclude: [
                "password",
                "pinRecuperacion",
                "fechaPin",
              ],
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message:
            "Usuario no encontrado",
        });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Error obteniendo perfil",
      });
    }
  };

// ==========================================
// LOGOUT
// ==========================================

const logout = (
  req,
  res
) => {
  res.clearCookie(
    "accessToken",
    {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    }
  );

  return res.status(200).json({
    message:
      "Sesión cerrada",
  });
};

// ==========================================
// EXPORTAR
// ==========================================

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
  reenviarPin,
  cambiarPassword,
  obtenerMiPerfil,
  logout,
};
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SolicitudCarnet = sequelize.define(
  "SolicitudCarnet",
  {
    // =====================================================
    // ID
    // =====================================================
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // =====================================================
    // USUARIO
    // =====================================================
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        notNull: {
          msg: "El usuario es obligatorio",
        },

        isInt: {
          msg: "El ID del usuario debe ser un número entero",
        },

        min: {
          args: [1],
          msg: "El ID del usuario debe ser válido",
        },
      },
    },

    // =====================================================
    // TIPO DE VEHÍCULO
    // =====================================================
    tipoVehiculo: {
      type: DataTypes.ENUM("bicicleta", "moto"),
      allowNull: false,

      validate: {
        notNull: {
          msg: "El tipo de vehículo es obligatorio",
        },

        isIn: {
          args: [["bicicleta", "moto"]],
          msg: "El tipo de vehículo debe ser bicicleta o moto",
        },
      },
    },

    // =====================================================
    // MARCA
    // =====================================================
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La marca es obligatoria",
        },

        notEmpty: {
          msg: "La marca no puede estar vacía",
        },

        len: {
          args: [2, 50],
          msg: "La marca debe tener entre 2 y 50 caracteres",
        },
      },
    },

    // =====================================================
    // COLOR
    // =====================================================
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,

      validate: {
        notNull: {
          msg: "El color es obligatorio",
        },

        notEmpty: {
          msg: "El color no puede estar vacío",
        },

        len: {
          args: [2, 30],
          msg: "El color debe tener entre 2 y 30 caracteres",
        },
      },
    },

    // =====================================================
    // SERIAL / PLACA
    // =====================================================
    serialPlaca: {
      type: DataTypes.STRING(30),
      allowNull: false,

      validate: {
        notNull: {
          msg: "El serial o placa es obligatorio",
        },

        notEmpty: {
          msg: "El serial o placa no puede estar vacío",
        },

        len: {
          args: [3, 30],
          msg: "El serial o placa debe tener entre 3 y 30 caracteres",
        },

        is: {
          args: /^[A-Za-z0-9-]+$/,
          msg: "El serial o placa solo puede contener letras, números y guiones",
        },
      },
    },

    // =====================================================
    // CILINDRAJE
    // =====================================================
    cilindraje: {
      type: DataTypes.STRING(10),
      allowNull: true,

      validate: {
        len: {
          args: [1, 10],
          msg: "El cilindraje no puede superar los 10 caracteres",
        },

        isNumeric: {
          msg: "El cilindraje solo puede contener números",
        },
      },
    },

    // =====================================================
    // MODELO
    // =====================================================
    modelo: {
      type: DataTypes.STRING(10),
      allowNull: true,

      validate: {
        len: {
          args: [2, 10],
          msg: "El modelo debe tener entre 2 y 10 caracteres",
        },

        isNumeric: {
          msg: "El modelo solo puede contener números",
        },
      },
    },

    // =====================================================
    // FOTO DEL APRENDIZ
    // =====================================================
    fotoAprendiz: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La foto del aprendiz es obligatoria",
        },

        notEmpty: {
          msg: "La foto del aprendiz es obligatoria",
        },
      },
    },

    // =====================================================
    // FOTO DEL VEHÍCULO
    // =====================================================
    fotoVehiculo: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La foto del vehículo es obligatoria",
        },

        notEmpty: {
          msg: "La foto del vehículo es obligatoria",
        },
      },
    },

    // =====================================================
    // FOTO CÉDULA
    // =====================================================
    fotoCedula: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La foto de la cédula es obligatoria",
        },

        notEmpty: {
          msg: "La foto de la cédula es obligatoria",
        },
      },
    },

    // =====================================================
    // TARJETA DE PROPIEDAD
    // =====================================================
    tarjetaPropiedad: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La tarjeta de propiedad es obligatoria",
        },

        notEmpty: {
          msg: "La tarjeta de propiedad es obligatoria",
        },
      },
    },

    // =====================================================
    // SOAT
    // Solo se utiliza para moto
    // =====================================================
    soat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // =====================================================
    // TECNOMECÁNICA
    // Solo se utiliza para moto
    // =====================================================
    tecnomecanica: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // =====================================================
    // FOTO PLACA / SERIAL
    // Bicicleta = serial
    // Moto = placa
    // =====================================================
    fotoPlacaSerial: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notNull: {
          msg: "La foto del serial o placa es obligatoria",
        },

        notEmpty: {
          msg: "La foto del serial o placa es obligatoria",
        },
      },
    },

    // =====================================================
    // CAMPOS ANTIGUOS
    // Se mantienen por compatibilidad
    // =====================================================
    formatoDiligenciado: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    documentosAnexos: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // =====================================================
    // ESTADO
    // =====================================================
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "aprobada",
        "rechazada",
        "carnet_generado"
      ),

      allowNull: false,

      defaultValue: "pendiente",

      validate: {
        isIn: {
          args: [[
            "pendiente",
            "aprobada",
            "rechazada",
            "carnet_generado",
          ]],

          msg: "El estado de la solicitud no es válido",
        },
      },
    },
  },

  {
    // =====================================================
    // HOOKS
    // =====================================================
    hooks: {
      beforeValidate: (solicitud) => {
        if (typeof solicitud.tipoVehiculo === "string") {
          solicitud.tipoVehiculo =
            solicitud.tipoVehiculo
              .trim()
              .toLowerCase();
        }

        if (typeof solicitud.marca === "string") {
          solicitud.marca =
            solicitud.marca.trim();
        }

        if (typeof solicitud.color === "string") {
          solicitud.color =
            solicitud.color.trim();
        }

        if (typeof solicitud.serialPlaca === "string") {
          solicitud.serialPlaca =
            solicitud.serialPlaca
              .trim()
              .toUpperCase();
        }

        if (typeof solicitud.cilindraje === "string") {
          solicitud.cilindraje =
            solicitud.cilindraje.trim();
        }

        if (typeof solicitud.modelo === "string") {
          solicitud.modelo =
            solicitud.modelo.trim();
        }

        if (typeof solicitud.fotoAprendiz === "string") {
          solicitud.fotoAprendiz =
            solicitud.fotoAprendiz.trim();
        }

        if (typeof solicitud.fotoVehiculo === "string") {
          solicitud.fotoVehiculo =
            solicitud.fotoVehiculo.trim();
        }

        if (typeof solicitud.fotoCedula === "string") {
          solicitud.fotoCedula =
            solicitud.fotoCedula.trim();
        }

        if (typeof solicitud.tarjetaPropiedad === "string") {
          solicitud.tarjetaPropiedad =
            solicitud.tarjetaPropiedad.trim();
        }

        if (typeof solicitud.soat === "string") {
          solicitud.soat =
            solicitud.soat.trim();
        }

        if (typeof solicitud.tecnomecanica === "string") {
          solicitud.tecnomecanica =
            solicitud.tecnomecanica.trim();
        }

        if (typeof solicitud.fotoPlacaSerial === "string") {
          solicitud.fotoPlacaSerial =
            solicitud.fotoPlacaSerial.trim();
        }

        if (typeof solicitud.formatoDiligenciado === "string") {
          solicitud.formatoDiligenciado =
            solicitud.formatoDiligenciado.trim();
        }

        if (typeof solicitud.documentosAnexos === "string") {
          solicitud.documentosAnexos =
            solicitud.documentosAnexos.trim();
        }
      },
    },
  }
);

module.exports = SolicitudCarnet;
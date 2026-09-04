const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SolicitudCarnet = sequelize.define(
  "SolicitudCarnet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

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

    marca: {
      type: DataTypes.STRING,
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

    color: {
      type: DataTypes.STRING,
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

    serialPlaca: {
      type: DataTypes.STRING,
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

    cilindraje: {
      type: DataTypes.STRING,
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

    modelo: {
      type: DataTypes.STRING,
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

    fotoAprendiz: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto del aprendiz es obligatoria",
        },
        notEmpty: {
          msg: "La foto del aprendiz es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto del aprendiz no es válida",
        },
      },
    },

    fotoVehiculo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto del vehículo es obligatoria",
        },
        notEmpty: {
          msg: "La foto del vehículo es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto del vehículo no es válida",
        },
      },
    },

    formatoDiligenciado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El formato diligenciado es obligatorio",
        },
        notEmpty: {
          msg: "El formato diligenciado es obligatorio",
        },
        len: {
          args: [1, 255],
          msg: "La ruta del formato diligenciado no es válida",
        },
      },
    },

    documentosAnexos: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 255],
          msg: "La ruta de los documentos anexos no es válida",
        },
      },
    },

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
    hooks: {
      beforeValidate: (solicitud) => {
        if (typeof solicitud.tipoVehiculo === "string") {
          solicitud.tipoVehiculo = solicitud.tipoVehiculo
            .trim()
            .toLowerCase();
        }

        if (typeof solicitud.marca === "string") {
          solicitud.marca = solicitud.marca.trim();
        }

        if (typeof solicitud.color === "string") {
          solicitud.color = solicitud.color.trim();
        }

        if (typeof solicitud.serialPlaca === "string") {
          solicitud.serialPlaca = solicitud.serialPlaca
            .trim()
            .toUpperCase();
        }

        if (typeof solicitud.cilindraje === "string") {
          solicitud.cilindraje = solicitud.cilindraje.trim();
        }

        if (typeof solicitud.modelo === "string") {
          solicitud.modelo = solicitud.modelo.trim();
        }

        if (typeof solicitud.fotoAprendiz === "string") {
          solicitud.fotoAprendiz = solicitud.fotoAprendiz.trim();
        }

        if (typeof solicitud.fotoVehiculo === "string") {
          solicitud.fotoVehiculo = solicitud.fotoVehiculo.trim();
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
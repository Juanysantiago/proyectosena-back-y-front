const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  documento: {
    type: DataTypes.STRING,
    allowNull: false
  },

  tipoDocumento: {
    type: DataTypes.ENUM("CC", "TI", "CE", "PAS"),
    allowNull: false
  },

  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },

  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },

  ficha: {
    type: DataTypes.STRING,
    allowNull: true
  },

  celular: {
    type: DataTypes.STRING,
    allowNull: true
  },

  rol: {
    type: DataTypes.ENUM(
      "aprendiz",
      "guarda",
      "administrador"
    ),
    allowNull: false
  },

  pinRecuperacion: {
    type: DataTypes.STRING,
    allowNull: true
  },

  fechaPin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = User;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },

  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },

  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  tipoDocumento: {
    type: DataTypes.STRING,
    allowNull: false
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

  ficha: {
    type: DataTypes.STRING,
    allowNull: true
  },

  rol: {
    type: DataTypes.ENUM("admin", "instructor", "aprendiz"),
    defaultValue: "aprendiz"
  }
});

module.exports = User;
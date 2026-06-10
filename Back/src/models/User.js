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

  ficha: {
    type: DataTypes.STRING,
    allowNull: true
  },

  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },

  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rol: {
    type: DataTypes.ENUM("aprendiz", "guarda"),
    allowNull: false
  }
});

module.exports = User;
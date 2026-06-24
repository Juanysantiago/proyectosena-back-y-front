const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notificacion = sequelize.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }
);

module.exports = Notificacion;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Carnet = sequelize.define("Carnet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  solicitudId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  codigoQr: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  estado: {
    type: DataTypes.ENUM(
      "activo",
      "vencido",
      "bloqueado"
    ),
    defaultValue: "activo"
  }
});

module.exports = Carnet;
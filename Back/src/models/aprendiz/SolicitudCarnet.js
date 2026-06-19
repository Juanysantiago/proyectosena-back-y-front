const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../User");

const SolicitudCarnet = sequelize.define("solicitudes_carnet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  fotoAprendiz: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fotoVehiculo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  serialPlaca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  formatoDiligenciado: {
    type: DataTypes.STRING,
    allowNull: false
  },

  documentosAnexos: {
    type: DataTypes.STRING,
    allowNull: true
  },

  estado: {
    type: DataTypes.ENUM("pendiente", "aprobada", "rechazada"),
    defaultValue: "pendiente"
  }
});

// 🔥 ESTO ES LO QUE TE FALTA
User.hasMany(SolicitudCarnet, {
  foreignKey: "userId"
});

SolicitudCarnet.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = SolicitudCarnet;
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SolicitudCarnet = sequelize.define("SolicitudCarnet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tipoVehiculo: {
    type: DataTypes.ENUM("bicicleta", "moto"),
    allowNull: false
  },

  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  color: {
    type: DataTypes.STRING,
    allowNull: false
  },

  serialPlaca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  cilindraje: {
    type: DataTypes.STRING,
    allowNull: true
  },

  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  fotoAprendiz: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fotoVehiculo: {
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
  type: DataTypes.ENUM(
    "pendiente",
    "aprobada",
    "rechazada",
    "carnet_generado"
  ),
  defaultValue: "pendiente"
}
});

module.exports = SolicitudCarnet;
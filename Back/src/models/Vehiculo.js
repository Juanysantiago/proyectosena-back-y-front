const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vehiculo = sequelize.define("vehiculos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  tipo: DataTypes.STRING,
  id_centro_de_formacion: DataTypes.INTEGER,
  marca: DataTypes.STRING,
  color: DataTypes.STRING,
  serial: DataTypes.STRING,
  placa: DataTypes.STRING,
  cilindraje: DataTypes.STRING,
  modelo: DataTypes.STRING,
  foto_principal: DataTypes.TEXT,
  foto_secundaria: DataTypes.TEXT
});

module.exports = Vehiculo;
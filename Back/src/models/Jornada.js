const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Jornada = sequelize.define("jornada", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  sigla_jornada: DataTypes.STRING,
  nombre_jornada: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  imagen_url: DataTypes.STRING,
  estado: DataTypes.STRING
});

module.exports = Jornada;
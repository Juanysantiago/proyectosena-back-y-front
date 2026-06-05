const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConfigGr = sequelize.define("config_gr", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  art_direccion_gr: DataTypes.STRING,
  fecha_conexion: DataTypes.DATEONLY,
  id_calcular: DataTypes.INTEGER
});

module.exports = ConfigGr;
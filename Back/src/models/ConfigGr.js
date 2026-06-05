const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConfigGr = sequelize.define(
  "ConfigGr",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    art_direccion_gr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_conexion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_calcular: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "config_gr", // 👈 IMPORTANTE (nombre real de la tabla)
    timestamps: true
  }
);

module.exports = ConfigGr;
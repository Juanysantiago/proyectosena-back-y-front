const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Reporte = sequelize.define("Reporte", {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  estado: {
    type: DataTypes.ENUM("Pendiente", "Leído"),
    defaultValue: "Pendiente",
  },
});

module.exports = Reporte;
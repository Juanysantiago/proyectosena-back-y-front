const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EntradaSalidaAprendiz = sequelize.define("entrada_salida_aprendiz", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  hora_entrada: DataTypes.DATE,
  hora_salida: DataTypes.DATE,
  id_aprendiz: DataTypes.INTEGER,
  id_codigo_gr: DataTypes.INTEGER
});

module.exports = EntradaSalidaAprendiz;
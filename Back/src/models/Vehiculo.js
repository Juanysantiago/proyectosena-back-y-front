const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Vehiculo = sequelize.define(
  "vehiculos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    id_centro_de_formacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serial: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    placa: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cilindraje: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    modelo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    foto_principal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    foto_secundaria: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "vehiculos",
  }
);

module.exports = Vehiculo;
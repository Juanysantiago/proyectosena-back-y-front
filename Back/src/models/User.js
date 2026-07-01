const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },

  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },

  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  tipoDocumento: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

centroFormacionId: {
  type: DataTypes.INTEGER,
  allowNull: true
},

  ficha: {
    type: DataTypes.STRING,
    allowNull: true
  },

  rol: {
    type: DataTypes.ENUM("administrador", "guarda", "aprendiz"),
    defaultValue: "aprendiz"
  },

  celular: {
  type: DataTypes.STRING,
  allowNull: true
},

foto: {
  type: DataTypes.STRING,
  allowNull: true
},

fechaVinculacion: {
  type: DataTypes.DATEONLY,
  allowNull: true
},

fechaFinalizacion: {
  type: DataTypes.DATEONLY,
  allowNull: true
},

pinRecuperacion: {
  type: DataTypes.STRING(6),
  allowNull: true
},

fechaPin: {
  type: DataTypes.DATE,
  allowNull: true
},

estado: {
  type: DataTypes.STRING,
  defaultValue: "activo"
},

});

module.exports = User;
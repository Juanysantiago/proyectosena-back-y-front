const User = require("./User");
const Vehiculo = require("./Vehiculo");
const SolicitudCarnet = require("./aprendiz/SolicitudCarnet");
const TipoDocumento = require("./TipoDocumento");
const Jornada = require("./Jornada");
const ConfigGr = require("./ConfigGr");
const EntradaSalidaAprendiz = require("./EntradaSalidaAprendiz");
const Carnet = require("./Carnet");
const CentroFormacion = require("./CentroFormacion");

/* RELACIONES */
User.hasMany(SolicitudCarnet, {
  foreignKey: "userId",
  as: "solicitudes"
});

SolicitudCarnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

User.hasMany(Carnet, {
  foreignKey: "userId",
  as: "carnets"
});

Carnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

CentroFormacion.hasMany(User, {
  foreignKey: "centroFormacionId",
  as: "usuarios"
});

User.belongsTo(CentroFormacion, {
  foreignKey: "centroFormacionId",
  as: "centroFormacion"
});

module.exports = {
  User,
  Vehiculo,
  SolicitudCarnet,
  TipoDocumento,
  Jornada,
  ConfigGr,
  EntradaSalidaAprendiz,
  Carnet,
  CentroFormacion
};
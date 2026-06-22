const User = require("./User");
const Vehiculo = require("./Vehiculo");
const SolicitudCarnet = require("./aprendiz/SolicitudCarnet");
const TipoDocumento = require("./TipoDocumento");
const Jornada = require("./Jornada");
const ConfigGr = require("./ConfigGr");
const EntradaSalidaAprendiz = require("./EntradaSalidaAprendiz");

/* RELACIONES */
User.hasMany(SolicitudCarnet, {
  foreignKey: "userId",
  as: "solicitudes"
});

SolicitudCarnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = {
  User,
  Vehiculo,
  SolicitudCarnet,
  TipoDocumento,
  Jornada,
  ConfigGr,
  EntradaSalidaAprendiz
};
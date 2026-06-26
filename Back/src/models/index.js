const User = require("./User");
const Vehiculo = require("./Vehiculo");
const SolicitudCarnet = require("./aprendiz/SolicitudCarnet");
const TipoDocumento = require("./TipoDocumento");
const Jornada = require("./Jornada");
const ConfigGr = require("./ConfigGr");
const EntradaSalidaAprendiz = require("./EntradaSalidaAprendiz");
const Carnet = require("./Carnet");
const CentroFormacion = require("./CentroFormacion");
const SolicitudActualizacion = require("./aprendiz/SolicitudActualizacion");
const Notificacion = require("./Notificacion");
const Reporte = require("./aprendiz/Reporte");

/* SOLICITUDES */
User.hasMany(SolicitudCarnet, {
  foreignKey: "userId",
  as: "solicitudes",
});

SolicitudCarnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/* CARNETS */
User.hasMany(Carnet, {
  foreignKey: "userId",
  as: "carnets",
});

Carnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/* CENTRO DE FORMACIÓN */
CentroFormacion.hasMany(User, {
  foreignKey: "centroFormacionId",
  as: "usuarios",
});

User.belongsTo(CentroFormacion, {
  foreignKey: "centroFormacionId",
  as: "centroFormacion",
});

/* ENTRADA / SALIDA */
EntradaSalidaAprendiz.belongsTo(User, {
  foreignKey: "id_aprendiz",
  as: "aprendiz",
});

User.hasMany(EntradaSalidaAprendiz, {
  foreignKey: "id_aprendiz",
  as: "entradasSalidas",
});

/* VEHÍCULOS */
User.hasMany(Vehiculo, {
  foreignKey: "userId",
  as: "vehiculos",
});

Vehiculo.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(SolicitudActualizacion,{
  foreignKey:"userId"
});

SolicitudActualizacion.belongsTo(User,{
  foreignKey:"userId",
  as:"user"
});

User.hasMany(Reporte, {
  foreignKey: "userId",
  as: "reportes",
});

Reporte.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  User,
  Vehiculo,
  SolicitudCarnet,
  SolicitudActualizacion,
  TipoDocumento,
  Jornada,
  ConfigGr,
  EntradaSalidaAprendiz,
  Carnet,
  CentroFormacion,
  Notificacion,
  Reporte,
};
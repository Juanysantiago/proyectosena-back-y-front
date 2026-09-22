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
const Soporte = require("./Soporte");
const ReporteBloqueo = require("./ReporteBloqueo");


/* =========================================================
   SOLICITUDES DE CARNET
========================================================= */

User.hasMany(SolicitudCarnet, {
  foreignKey: "userId",
  as: "solicitudes"
});

SolicitudCarnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


/* =========================================================
   CARNETS
========================================================= */

User.hasMany(Carnet, {
  foreignKey: "userId",
  as: "carnets"
});

Carnet.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


/* =========================================================
   CARNET ↔ SOLICITUD
========================================================= */

SolicitudCarnet.hasOne(Carnet, {
  foreignKey: "solicitudId",
  as: "carnet"
});

Carnet.belongsTo(SolicitudCarnet, {
  foreignKey: "solicitudId",
  as: "solicitud"
});


/* =========================================================
   CENTRO DE FORMACIÓN
========================================================= */

CentroFormacion.hasMany(User, {
  foreignKey: "centroFormacionId",
  as: "usuarios"
});

User.belongsTo(CentroFormacion, {
  foreignKey: "centroFormacionId",
  as: "centroFormacion"
});


/* =========================================================
   ENTRADA / SALIDA
========================================================= */

EntradaSalidaAprendiz.belongsTo(User, {
  foreignKey: "id_aprendiz",
  as: "aprendiz"
});

User.hasMany(EntradaSalidaAprendiz, {
  foreignKey: "id_aprendiz",
  as: "entradasSalidas"
});


/* =========================================================
   VEHÍCULOS
========================================================= */

User.hasMany(Vehiculo, {
  foreignKey: "userId",
  as: "vehiculos"
});

Vehiculo.belongsTo(User, {
  foreignKey: "userId",
  as: "User"
});


/* =========================================================
   SOLICITUDES DE ACTUALIZACIÓN
========================================================= */

User.hasMany(SolicitudActualizacion, {
  foreignKey: "userId",
  as: "solicitudesActualizacion"
});

SolicitudActualizacion.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


/* =========================================================
   REPORTES
========================================================= */

User.hasMany(Reporte, {
  foreignKey: "userId",
  as: "reportes"
});

Reporte.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


/* =========================================================
   SOPORTE
========================================================= */

User.hasMany(Soporte, {
  foreignKey: "userId",
  as: "soportes"
});

Soporte.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


/* =========================================================
   REPORTES / BLOQUEOS
========================================================= */

User.hasMany(ReporteBloqueo, {
  foreignKey: "userId",
  as: "reportesBloqueos"
});

ReporteBloqueo.belongsTo(User, {
  foreignKey: "userId",
  as: "usuario"
});

User.hasMany(ReporteBloqueo, {
  foreignKey: "creadoPor",
  as: "accionesRealizadas"
});

ReporteBloqueo.belongsTo(User, {
  foreignKey: "creadoPor",
  as: "creador"
});


/* =========================================================
   EXPORTAR
========================================================= */

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
  Soporte,
  ReporteBloqueo
};
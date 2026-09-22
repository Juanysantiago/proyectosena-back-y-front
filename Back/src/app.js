require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");

const app = express();

// ======================================================
// MODELOS
// ======================================================

require("./models");

// ======================================================
// RUTA REAL DE UPLOADS
// app.js está en:
// Back/src/app.js
//
// uploads está en:
// Back/uploads
//
// Por eso usamos ../uploads
// ======================================================

const uploadsPath = path.resolve(
  __dirname,
  "../uploads"
);

console.log("=================================");
console.log("📁 CARPETA UPLOADS:");
console.log(uploadsPath);
console.log("=================================");

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ======================================================
// COOKIES
// ======================================================

app.use(cookieParser());

// ======================================================
// BODY
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================================
// ARCHIVOS ESTÁTICOS
// ======================================================

// IMPORTANTE:
// http://localhost:3000/uploads/archivo.jpg
//
// apunta a:
// Back/uploads/archivo.jpg
// ======================================================

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ======================================================
// PRUEBA DE UPLOADS
// ======================================================

app.get("/test-uploads", (req, res) => {
  res.json({
    message: "Uploads funcionando",
    carpeta: uploadsPath,
  });
});

// ======================================================
// RUTAS AUTH
// ======================================================

app.use(
  "/auth",
  require("./routers/authRouter")
);

// ======================================================
// RUTAS API
// ======================================================

app.use(
  "/api",
  require("./routers/tipoDocumentoRouter")
);

app.use(
  "/api",
  require("./routers/jornadaRouter")
);

app.use(
  "/api",
  require("./routers/entradaSalidaAprendizRouter")
);

app.use(
  "/api",
  require("./routers/configGrRouter")
);

app.use(
  "/api",
  require("./routers/centroFormacionRouter")
);

app.use(
  "/api",
  require("./routers/notificacionRouter")
);

app.use(
  "/api",
  require("./routers/soporteRouter")
);

// ======================================================
// CARNET
// ======================================================

app.use(
  "/api/carnet",
  require("./routers/carnetRouter")
);

// ======================================================
// VEHICULOS
// ======================================================

app.use(
  "/api/vehiculos",
  require("./routers/vehiculoRouter")
);

// ======================================================
// SOLICITUD CARNET
// ======================================================

app.use(
  "/api",
  require("./routers/aprendiz/solicitudCarnetRouter")
);

// ======================================================
// ACTUALIZACIONES
// ======================================================

app.use(
  "/api",
  require("./routers/aprendiz/solicitudActualizacionRouter")
);

// ======================================================
// REPORTES APRENDIZ
// ======================================================

app.use(
  "/api",
  require("./routers/aprendiz/reportesRouter")
);

// ======================================================
// REPORTES
// ======================================================

app.use(
  "/api",
  require("./routers/reportesRouter")
);

// ======================================================
// RUTA NO ENCONTRADA
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    ruta: req.originalUrl,
  });
});

// ======================================================
// BASE DE DATOS
// ======================================================

sequelize
  .authenticate()
  .then(async () => {

    console.log("✅ DB conectada");

    await sequelize.sync();

    console.log("✅ Tablas sincronizadas");

  })
  .catch((err) => {

    console.error(
      "❌ Error de base de datos:",
      err
    );

  });

// ======================================================
// SERVIDOR
// ======================================================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Servidor ejecutándose en http://localhost:${PORT}`
  );

});
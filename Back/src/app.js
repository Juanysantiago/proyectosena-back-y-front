require("dotenv").config();

const express = require("express");
const path = require("path");
const sequelize = require("./config/database");

const app = express();

/* MODELOS */
require("./models");

/* CORS */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* BODY PARSER */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ARCHIVOS ESTÁTICOS */
app.use(
  "/uploads",
  express.static(
    path.resolve(__dirname, "../uploads")
  )
);

/* RUTAS */
app.use("/auth", require("./routers/authRouter"));

app.use("/api", require("./routers/tipoDocumentoRouter"));
app.use("/api", require("./routers/jornadaRouter"));
app.use("/api", require("./routers/entradaSalidaAprendizRouter"));
app.use("/api", require("./routers/configGrRouter"));
app.use("/api", require("./routers/centroFormacionRouter"));
app.use("/api",require("./routers/notificacionRouter"));

app.use(
  "/api/carnet",
  require("./routers/carnetRouter")
);

app.use(
  "/api/vehiculos",
  require("./routers/vehiculoRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/solicitudCarnetRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/solicitudActualizacionRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/reportesRouter")
);

/* BASE DE DATOS */
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB conectada");

    await sequelize.sync();

    console.log("✅ Tablas sincronizadas");
  })
  .catch((err) => {
    console.error("❌ Error DB:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 Servidor ejecutándose en puerto ${PORT}`
  );
});
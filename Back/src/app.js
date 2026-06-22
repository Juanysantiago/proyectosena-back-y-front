require("dotenv").config();

const express = require("express");
const path = require("path");
const sequelize = require("./config/database");

const app = express();

/* MODELOS */
require("./models");

/* CORS SIMPLE */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

/* ARCHIVOS */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ROUTES */
app.use("/auth", require("./routers/authRouter"));
app.use("/api", require("./routers/tipoDocumentoRouter"));
app.use("/api", require("./routers/jornadaRouter"));
app.use("/api", require("./routers/entradaSalidaAprendizRouter"));
app.use("/api", require("./routers/configGrRouter"));
app.use("/api/carnet", require("./routers/carnetRouter"));
app.use("/api/vehiculos", require("./routers/vehiculoRouter"));
app.use("/api", require("./routers/aprendiz/solicitudCarnetRouter"));

/* DB */
sequelize.authenticate()
  .then(async () => {
    console.log("✅ DB conectada");
    await sequelize.sync();
    console.log("✅ Tablas sincronizadas");
  })
  .catch(err => console.error("❌ Error DB:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
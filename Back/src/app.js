require("dotenv").config();

const express = require("express");
const sequelize = require("./config/database");

const app = express();

/* IMPORTAR MODELOS */
require("./models/User");
require("./models/Vehiculo");

/* CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
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

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API SENA Parking funcionando correctamente"
  });
});

app.use("/auth", require("./routers/authRouter"));
app.use("/api", require("./routers/tipoDocumentoRouter"));
app.use("/api", require("./routers/jornadaRouter"));
app.use("/api", require("./routers/entradaSalidaAprendizRouter"));
app.use("/api", require("./routers/configGrRouter"));
app.use("/api/vehiculos", require("./routers/vehiculoRouter"));

sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB conectada correctamente");

    await sequelize.sync({ alter: true });

    console.log("✅ Tablas sincronizadas");
  })
  .catch((err) => {
    console.error("❌ Error DB:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
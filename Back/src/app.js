const express = require("express");
const sequelize = require("./config/database");

const app = express();

/* CORS FIX */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

/* RUTAS */
app.use("/auth", require("./routers/authRouter"));
app.use("/api", require("./routers/tipoDocumentoRouter"));
app.use("/api", require("./routers/jornadaRouter"));
app.use("/api", require("./routers/entradaSalidaAprendizRouter"));
app.use("/api", require("./routers/configGrRouter"));

/* 🔥 VEHICULOS BIEN IMPORTADO */
const vehiculoRouter = require("./routers/vehiculoRouter");
app.use("/api/vehiculos", vehiculoRouter);

sequelize
  .authenticate()
  .then(() => console.log("DB conectada correctamente"))
  .catch(err => console.log("Error DB:", err));

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
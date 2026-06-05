const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

require("./models/User");
require("./models/TipoDocumento");
require("./models/Jornada");
require("./models/Vehiculo");
require("./models/ConfigGr");
require("./models/EntradaSalidaAprendiz");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando correctamente"
  });
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Base de datos conectada");
    
    app.listen(3000, () => {
      console.log("🚀 Servidor ejecutándose en http://localhost:3000");
    });
  })
  .catch(error => {
    console.error("❌ Error de conexión:", error);
  });
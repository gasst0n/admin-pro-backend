const express = require("express");
require("dotenv").config();
const path = require("path");

// CORS
const cors = require("cors");
const app = express();

app.use(cors());

// Servir carpeta pública
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

// Conexión a base de datos
const { dbConnection } = require("./Databases/config");
dbConnection();

// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));

/**
 * ✅ PUERTO
 * Render inyecta el puerto en process.env.PORT
 * En local usa 3000
 */
const PORT = process.env.PORT || 3000;

// LO ULTIMO

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});

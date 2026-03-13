const express = require("express");

require("dotenv").config();

//CORS
const cors = require("cors");
const app = express();

app.use(cors());

// Carpeta publica

app.use(express.static("public"));

// Lectura y parseo del BODY
app.use(express.json());

const { dbConnection } = require("./Databases/config");

// Base de datos

dbConnection();

console.log(process.env);

// Crear el servidor EXPRESS

// RUTAS

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));

// Database

// mean_user
// g3FtrH2arfc9WfL8

// PUERTO

app.listen(3000, () => console.log("Servidor corriendo en puerto ", 3000));

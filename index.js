const express = require("express");

require("dotenv").config();

//CORS
const cors = require("cors");
const app = express();

app.use(cors());

// Lectura y parseo del BODY
app.use(express.json());

const { dbConnection } = require("./Databases/config");

// Base de datos

dbConnection();

console.log(process.env);

// Crear el servidor EXPRESS

// RUTAS

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/login", require("./routes/auth"));

// Database

// mean_user
// g3FtrH2arfc9WfL8

// PUERTO

app.listen(3000, () => console.log("Servidor corriendo en puerto ", 3000));

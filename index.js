const express = require('express');

require('dotenv').config();

//CORS
const cors = require('cors');
const app = express();

app.use(cors() );

const { dbConnection } = require('./Databases/config');

// Base de datos

dbConnection();

console.log(process.env);

// Crear el servidor EXPRESS



// RUTAS

app.get( '/', (req,res) => {

    res.json({
        ok: true,
        msg: 'Hola Mundo!'
    })


} );




// Database

// mean_user
// g3FtrH2arfc9WfL8


// PUERTO

app.listen( 3000, () => (
    console.log('Servidor corriendo en puerto ', 3000)
));
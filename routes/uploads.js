// ruta: api/uploads

const { Router } = require("express");
const expressFileUpload = require("express-fileupload");

const { validarJWT } = require("../middlewares/validar-jwt");
const { fileUpload, retornaImagen } = require("../controllers/uploads");

const router = Router();

// Middleware global (solo una vez)
router.use(expressFileUpload());

// SUBIR IMAGEN
router.put("/:tipo/:id", validarJWT, fileUpload);

// OBTENER IMAGEN
router.get("/:tipo/:foto", retornaImagen);

module.exports = router;

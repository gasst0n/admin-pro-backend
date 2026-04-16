// Ruta: /api/usuarios

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  crearUsuario,
  actualizarUsuarios,
  borrarUsuario,
} = require("../controllers/usuarios");
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getUsuarios);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El EMAIL es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario,
);

router.put(
  "/:id",
  [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El EMAIL es obligatorio").isEmail(),
    check("role", "El ROL es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuarios,
);

router.delete("/:id", borrarUsuario, validarJWT, validarADMIN_ROLE);

module.exports = router;

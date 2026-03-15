const { response } = require("express");
const Usuario = require("../models/usuario");

const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { IdTokenClient } = require("google-auth-library");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email

    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no valido",
      });
    }

    // Verifica contrasela

    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no valida",
      });
    }

    // Generar TOKEN - JWT

    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el Administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
      // usuario.password = '@@'
    }
    //GUARDAR USUARIO
    await usuario.save();

    // Generar el TOKEN -JWT

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El TOKEN de Google no es correcto",
    });
  }
};

// REGENERAR TOKEN

const renewToken = async (req, res = response) => {
  // UID del usuario

  const uid = req.uid;

  // Generar el TOKEN -JWT

  const token = await generarJWT(uid);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};

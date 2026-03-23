const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

// =============================
// SUBIR ARCHIVO
// =============================
const fileUpload = (req, res = response) => {
  const { tipo, id } = req.params;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "Tipo no válido (hospitales, medicos, usuarios)",
    });
  }

  // Validar archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningún archivo",
    });
  }

  const file = req.files.imagen;

  // Validar extensión
  const nombreCortado = file.name.split(".");
  const extensionArchivo =
    nombreCortado[nombreCortado.length - 1].toLowerCase();

  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "Extensión no válida",
    });
  }

  // Generar nombre único
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  // Path correcto (IMPORTANTE no pisar "path")
  const filePath = path.join(__dirname, `../uploads/${tipo}/${nombreArchivo}`);

  // Crear carpeta si no existe (pro)
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Mover archivo
  file.mv(filePath, (err) => {
    if (err) {
      console.error("Error moviendo archivo:", err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    // Actualizar DB (después de guardar correctamente)
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo subido",
      nombreArchivo,
    });
  });
};

// =============================
// RETORNAR IMAGEN
// =============================
const retornaImagen = (req, res) => {
  const { tipo, foto } = req.params;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImg)) {
    return res.sendFile(
      pathImg,
      {
        headers: {
          "Content-Type": "image/jpeg",
        },
      },
      (err) => {
        if (err) {
          console.error("Error enviando imagen:", err);
          res.status(500).send("Error al cargar imagen");
        }
      },
    );
  }

  // Imagen por defecto
  const pathNoImg = path.join(__dirname, `../uploads/noimg.jpg`);

  return res.sendFile(pathNoImg, (err) => {
    if (err) {
      console.error("Error enviando imagen default:", err);
      res.status(500).send("Error al cargar imagen por defecto");
    }
  });
};

module.exports = {
  fileUpload,
  retornaImagen,
};

const fs = require("fs");
const path = require("path");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarImagen = (pathImagen) => {
  if (pathImagen && fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let modelo;
  let pathViejo;

  switch (tipo) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) throw new Error("Usuario no existe");

      pathViejo = path.join(__dirname, `../uploads/usuarios/${modelo.img}`);
      break;

    case "hospitales":
      modelo = await Hospital.findById(id);
      if (!modelo) throw new Error("Hospital no existe");

      pathViejo = path.join(__dirname, `../uploads/hospitales/${modelo.img}`);
      break;

    case "medicos":
      modelo = await Medico.findById(id);
      if (!modelo) throw new Error("Medico no existe");

      pathViejo = path.join(__dirname, `../uploads/medicos/${modelo.img}`);
      break;

    default:
      throw new Error("Tipo no soportado");
  }

  // Borrar imagen anterior (si existe)
  borrarImagen(pathViejo);

  // Guardar nueva imagen
  modelo.img = nombreArchivo;
  await modelo.save();

  return true;
};

module.exports = {
  actualizarImagen,
};

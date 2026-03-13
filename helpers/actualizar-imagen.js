const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

let pathViejo = "";

const borrarImagen = (path) => {
  if (fs.existsSync(pathViejo)) {
    // borrar imagen anterior
    fs.unlinkSync(pathViejo);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  switch (tipo) {
    case "medicos":
      const medico = await Medico.findById(id);

      if (!medico) {
        console.log("No es un medico por ID");
        return false;
      }

      pathViejo = `./uploads/medicos/${medico.img}`;
      borrarImagen(pathViejo);

      medico.img = nombreArchivo;
      await medico.save();

      return true;

    case "hospitales":
      const hospital = await Hospital.findById(id);

      if (!hospital) {
        console.log("No es un medico por ID");
        return false;
      }

      pathViejo = `./uploads/hospitales/${hospital.img}`;
      borrarImagen(pathViejo);

      hospital.img = nombreArchivo;
      await hospital.save();

      return true;

    case "usuarios":
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        console.log("No es un medico por ID");
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.img}`;
      borrarImagen(pathViejo);

      usuario.img = nombreArchivo;
      await usuario.save();

      return true;

    default:
      break;
  }
};

module.exports = {
  actualizarImagen,
};

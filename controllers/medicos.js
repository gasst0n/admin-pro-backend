/**
 * Controller de Médicos
 * CRUD completo con validaciones reales
 */

const { response } = require("express");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital"); // ✅ IMPORTANTE

/* ======================================================
   GET /api/medicos
   Devuelve todos los médicos con datos relacionados
====================================================== */
const getMedicos = async (req, res = response) => {
  try {
    const medicos = await Medico.find()
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    res.json({
      ok: true,
      medicos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error obteniendo médicos",
    });
  }
};

// OBTERNER MEDICO POR ID

// OBTENER MÉDICO POR ID
const getMedicoById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const medico = await Medico.findById(id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "Médico no encontrado",
      });
    }

    res.json({
      ok: true,
      medico, // ✅ SINGULAR
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      msg: "ID inválido",
    });
  }
};

/* ======================================================
   POST /api/medicos
   Crea un médico nuevo
====================================================== */
const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const { nombre, hospital } = req.body;

  console.log("UID:", req.uid);
  console.log("BODY:", req.body);

  // 🔒 VALIDACIÓN CRÍTICA
  if (!hospital) {
    return res.status(400).json({
      ok: false,
      msg: "El médico debe tener un hospital",
    });
  }

  try {
    // ✅ VALIDAMOS QUE EL HOSPITAL EXISTA
    const hospitalDB = await Hospital.findById(hospital);
    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: "El hospital no existe",
      });
    }

    // Creamos el médico
    const medico = new Medico({
      nombre,
      hospital,
      usuario: uid,
    });

    // Guardamos
    const medicoDB = await medico.save();

    // 🔁 Lo devolvemos populado (para frontend)
    const medicoPopulado = await Medico.findById(medicoDB._id)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    res.json({
      ok: true,
      medico: medicoPopulado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error creando médico",
    });
  }
};

/* ======================================================
   PUT /api/medicos/:id
   Actualiza un médico existente
====================================================== */
const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medico = await Medico.findById(id);

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "Médico no encontrado",
      });
    }

    // Si se envía hospital, validamos que exista
    if (req.body.hospital) {
      const hospitalDB = await Hospital.findById(req.body.hospital);
      if (!hospitalDB) {
        return res.status(400).json({
          ok: false,
          msg: "El hospital no existe",
        });
      }
    }

    const cambios = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(id, cambios, {
      new: true,
    })
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error actualizando médico",
    });
  }
};

/* ======================================================
   DELETE /api/medicos/:id
   Elimina un médico
====================================================== */
const borrarMedico = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id);

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "Médico no encontrado",
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Médico eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error eliminando médico",
    });
  }
};

module.exports = {
  getMedicos,
  getMedicoById,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
``;

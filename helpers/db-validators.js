const Tipo = require("../models/tipousuario");
const Personal = require("../models/personal");

const esRolValido = async (rol = "") => {
  const existeTipo = await Tipo.findOne({ rol });
  if (!existeTipo) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const correoExiste = async (correo = "") => {
  const existeCorreo = await Personal.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo ${correo} ya está en uso`);
  }
};

module.exports = {
  esRolValido,
  correoExiste
};

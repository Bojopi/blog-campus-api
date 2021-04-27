const { Schema, model } = require('mongoose');

const tipousuarioSchema = Schema({
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"],
        emun: ['Administrador', 'Usuario']
    }
})

//exportando el modelo
module.exports = model("tipo_usuarios", tipousuarioSchema)
const { Schema, model } = require('mongoose');

let tipousuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El rol es obligatorio"],
        emun: ['Administrador', 'Usuario']
    }
})

//exportando el modelo
module.exports = model("tipo_usuarios", tipousuarioSchema)
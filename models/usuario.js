const { Schema, model } = require('mongoose');

let usuarioSchema = Schema({
    usu: {
        type: String,
        required: [true, "El usuario es obligatorio"],
        unique: true
    },
    pass: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    id_tipo: {
        type: Schema.ObjectId,
        ref: "tipo_usuarios"
    },
    id_personal: {
        type: Schema.ObjectId,
        ref: "personals"
    }
})

//exportando el modelo
module.exports = model("usuarios", usuarioSchema)
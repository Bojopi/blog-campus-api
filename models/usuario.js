const { Schema, model } = require('mongoose');

let usuarioSchema = Schema({
    user: {
        type: String,
        required: [true, "El usuario es obligatorio"],
        unique: true
    },
    password: {
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
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"]
    },
    id_personal: {
        type: Schema.ObjectId,
        ref: "personals"
    }
})

usuarioSchema.methods.toJSON = function () { 
    const { __v, password, ...usuario } = this.toObject()
    return usuario
 }

//exportando el modelo
module.exports = model("usuarios", usuarioSchema)
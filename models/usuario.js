const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    usu: {
        type: String,
        required: [true, "El usuario es obligatorio"]
    },
    pass: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    id_tipo: {
        type: Schema.ObjectId,
        ref: "tipo_usuario"
    },
    id_personal: {
        type: Schema.ObjectId,
        ref: "personal"
    }
})

//exportando el modelo
module.exports = mongoose.model("usuarios", usuarioSchema)
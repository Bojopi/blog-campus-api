const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let comentarioSchema = new Schema({
    autor: {
        type: String,
        required: [true, "El autor es obligatorio"]
    },
    foto_autor: {
        type: String,
        required: false
    },
    fecha: {
        type: String,
        required: [true, "La fecha es obligatoria"]
    },
    hora: {
        type: String,
        required: [true, "La hora es obligatoria"]
    },
    comentario: {
        type: String,
        required: [true, "El comentario es obligatoria"]
    },
    id_articulo: {
        type: Schema.ObjectId,
        ref: "articulos"
    }
})

//exportando el modelo
module.exports = mongoose.model("comentarios", comentarioSchema)
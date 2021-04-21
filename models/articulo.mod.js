const mongoose = require('mongoose');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let articulosSchema = new Schema({
    portada: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    },
    url: {
        type: String,
        required: [true, "La url es obligatoria"]
    },
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    intro: {
        type: String,
        required: [true, "La intro es obligatoria"]
    },
    contenido: {
        type: String,
        required: [true, "El contenido es obligatorio"]
    }
})

//exportando el modelo
module.exports = mongoose.model("articulos", articulosSchema)
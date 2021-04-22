const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let articuloSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"]
    },
    introduccion: {
        type: String,
        required: [true, "La introduccion es obligatoria"]
    },
    contenido: {
        type: String,
        required: [true, "El contenido es obligatorio"]
    },
    fecha: {
        type: String,
        required: [true, "La fecha es obligatoria"]
    },
    img: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    },
    id_personal: {
        type: Schema.ObjectId,
        ref: "personals"
    }
})

//exportando el modelo
module.exports = mongoose.model("articulos", articuloSchema)
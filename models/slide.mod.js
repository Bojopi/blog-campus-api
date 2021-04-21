const mongoose = require('mongoose');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let imagesSchema = new Schema({
    imagen: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    },
    titulo: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    }
})

//exportamos el modelo
module.exports = mongoose.model("images", imagesSchema)
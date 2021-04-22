const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let recursoSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"]
    },
    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"]
    },
    logo: {
        type: String,
        required: [true, "El logo es obligatorio"]
    },
    video: {
        type: String,
        required: [true, "El video es obligatorio"]
    },
    enlace: {
        type: String,
        required: [true, "El enlace es obligatorio"]
    },
    id_categoria: {
        type: Schema.ObjectId,
        ref: "categoria"
    }
})

//exportando el modelo
module.exports = mongoose.model("recursos", recursoSchema)
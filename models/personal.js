const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let personalSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"]
    },
    telefono: {
        type: String,
        required: [true, "El telefono es obligatorio"]
    }
})

//exportando el modelo
module.exports = mongoose.model("personals", personalSchema) 
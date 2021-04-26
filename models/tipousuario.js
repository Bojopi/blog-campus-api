const mongoose = require('mongoose');
//const Personal = require('personal');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let tipousuarioSchema = new Schema({
    rol: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    }
})

//exportando el modelo
module.exports = mongoose.model("tipo_usuarios", tipousuarioSchema)
const mongoose = require('mongoose');

//esquema para el modelo conector a mongodb

let Schema = mongoose.Schema

let galeriaSchema = new Schema({
    foto: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    }
})

//exporando el modelo
module.exports = mongoose.model("galerias", galeriaSchema)
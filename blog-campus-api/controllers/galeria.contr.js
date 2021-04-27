const Galeria = require('../models/galeria.mod');

//peticiones get
let mostrarGaleria = (req, res) => {
    Galeria.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        //contar la cantidad de registros
        Galeria.countDocuments({}, (err, total) => {

            if(err){
                return res.json({
                    status: 500,
                    mensaje: "Error en la petición"
                })
            }

            res.json({
                status: 200,
                total,
                data
            })
        })
    })
}

//exportar las funciones del controlador
module.exports = {
    mostrarGaleria
} 
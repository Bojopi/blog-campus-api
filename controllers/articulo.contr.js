const Articulo = require('../models/articulo.mod');

//peticiones get
let mostrarArticulo = (req, res) => {
    Articulo.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        //contar la cantidad de registros
        Articulo.countDocuments({}, (err, total) => {

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
    mostrarArticulo
} 
//administrador de carpetas y archivos en nodejs
const fs = require('fs')
const Categoria = require('../models/categoria');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarCategoria = (req, res) => {
    Categoria.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        
        //contar la cantidad de registros
        Categoria.countDocuments({}, (err, total) => {

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



/*=============================================
=            PETICIONES POST            =
=============================================*/

let crearCategoria = (req, res) => {

    //obtenemos el cuerpo del formulario

    let body = req.body

    //obtenemos los datos del formulario para pasarlo al modelo
    
    let categoria = new Categoria({
        nombre: body.nombre
    })

    //guardamos en mongodb
    
    categoria.save((err, data) => {
        if (err) {
            return res.json({
                status: 400,
                mensaje: "Error al almacenar la categoria",
                err
            })
        }

        res.json({
            status: 200,
            data,
            mensaje: "La categoria ha sido creada con exito"
        })
    })
}


/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarCategoria = (req, res) => {
    
    //capturamos el id de la categoria que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE LA CATEGORIA EXISTA

    Categoria.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si la categoria no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "La categoria no existe en la base de datos",
                err
            })
            
        }
    
        //ACTUALIZAR LOS REGISTROS

        let cambiarRegistrosBD = (id, body) => {
            return new Promise((resolve, reject) => {
                let datosCategoria = {
                    nombre: body.nombre
                }
        
                //Acualizamos en mongodb
                Categoria.findByIdAndUpdate(id, datosCategoria, {new: true, runValidators: true}, (err, data) => {
                    if (err) {
                        let respuesta = {
                            res: res,
                            error: err
                        }

                        reject(respuesta)
                    }
                    let respuesta = {
                        res: res,
                        data: data
                    }

                    resolve(respuesta)
                })
            })
        }
        //validacion
        cambiarRegistrosBD(id, body).then(respuesta => {
            respuesta["res"].json({
                status: 200,
                data: respuesta["data"],
                mensaje: "La categoria ha sido actualizada con éxito"
            })
        }).catch(respuesta => {
            respuesta["res"].json({
                status: 400,
                err: respuesta["err"],
                mensaje: "Error al actualizar la categoria"
            })
            
        })

    })
}



/*=============================================
=            PETICION DELETE            =
=============================================*/

let eliminarCategoria = (req, res) => {
    //capturamos el id de la categoria que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE LA CATEGORIA EXISTA

    Categoria.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si la categoria no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "La categoria no existe en la base de datos",
                err
            })
            
        }

        //borramos el registro en MongoDB
        Categoria.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar la categoria",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "La categoria ha sido borrada correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
} 
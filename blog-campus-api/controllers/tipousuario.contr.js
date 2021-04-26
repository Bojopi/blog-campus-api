const TipoUsuario = require('../models/tipousuario');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarTipoUsuario = (req, res) => {
    TipoUsuario.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        
        //contar la cantidad de registros
        TipoUsuario.countDocuments({}, (err, total) => {

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

let crearTipoUsuario = (req, res) => {

    //obtenemos el cuerpo del formulario

    let body = req.body

    //obtenemos los datos del formulario para pasarlo al modelo
    
    let tipousuario = new TipoUsuario({
        rol: body.rol
    })

    //guardamos en mongodb
    
    tipousuario.save((err, data) => {
        if (err) {
            return res.json({
                status: 400,
                mensaje: "Error al almacenar el tipo de usuario",
                err
            })
        }

        res.json({
            status: 200,
            data,
            mensaje: "El tipo de usuario ha sido creado con exito"
        })
    })
}


/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarTipoUsuario = (req, res) => {
    
    //capturamos el id del tipo de usuario que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL TIPO DE USUARIO EXISTA

    TipoUsuario.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el personal no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El tipo de usuario no existe en la base de datos",
                err
            })
            
        }
    
        //ACTUALIZAR LOS REGISTROS

        let cambiarRegistrosBD = (id, body) => {
            return new Promise((resolve, reject) => {
                let datosTipoUsuario = {
                    rol: body.rol
                }
        
                //Acualizamos en mongodb
                TipoUsuario.findByIdAndUpdate(id, datosTipoUsuario, {new: true, runValidators: true}, (err, data) => {
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
                mensaje: "El tipo de usuario ha sido actualizado con éxito"
            })
        }).catch(respuesta => {
            respuesta["res"].json({
                status: 400,
                err: respuesta["err"],
                mensaje: "Error al actualizar el tipo de usuario"
            })
            
        })

    })
}



/*=============================================
=            PETICION DELETE            =
=============================================*/

let eliminarTipoUsuario = (req, res) => {
    //capturamos el id del tipo de usuario que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL TIPO DE USUARIO EXISTA

    TipoUsuario.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el tipo de usuario no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El tipo de usuario no existe en la base de datos",
                err
            })
            
        }

        //borramos el registro en MongoDB
        TipoUsuario.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el personal",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El tipo de usuario ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarTipoUsuario,
    crearTipoUsuario,
    editarTipoUsuario,
    eliminarTipoUsuario
} 
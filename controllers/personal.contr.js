const Personal = require('../models/personal');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarPersonal = (req, res) => {
    Personal.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        
        //contar la cantidad de registros
        Personal.countDocuments({}, (err, total) => {

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

let crearPersonal = async(req, res) => {

    //obtenemos el cuerpo del formulario

    const {nombre, apellido, correo, telefono} = req.body

    //obtenemos los datos del formulario para pasarlo al modelo
    
    const personal = new Personal({
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        telefono: telefono
    })

    //guardamos en mongodb
    
    personal.save((err, data) => {
        if (err) {
            return res.json({
                status: 400,
                mensaje: "Error al almacenar el Personal",
                err
            })
        }

        res.json({
            status: 200,
            data,
            mensaje: "El Personal ha sido creado con exito"
        })
    })
}


/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarPersonal = (req, res) => {
    
    //capturamos el id del personal que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL PERSONAL EXISTA

    Personal.findById(id, (err, data) => {
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
                mensaje: "El personal no existe en la base de datos",
                err
            })
            
        }
    
        //ACTUALIZAR LOS REGISTROS

        let cambiarRegistrosBD = (id, body) => {
            return new Promise((resolve, reject) => {
                let datosPersonal = {
                    nombre: body.nombre,
                    apellido: body.apellido,
                    correo: body.correo,
                    telefono: body.telefono
                }
        
                //Acualizamos en mongodb
                Personal.findByIdAndUpdate(id, datosPersonal, {new: true, runValidators: true}, (err, data) => {
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
                mensaje: "El personal ha sido actualizado con éxito"
            })
        }).catch(respuesta => {
            respuesta["res"].json({
                status: 400,
                err: respuesta["err"],
                mensaje: "Error al actualizar el personal"
            })
            
        })

    })
}



/*=============================================
=            PETICION DELETE            =
=============================================*/

let eliminarPersonal = (req, res) => {
    //capturamos el id del personal que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL PERSONAL EXISTA

    Personal.findById(id, (err, data) => {
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
                mensaje: "El personal no existe en la base de datos",
                err
            })
            
        }

        //borramos el registro en MongoDB
        Personal.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el personal",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El personal ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarPersonal,
    crearPersonal,
    editarPersonal,
    eliminarPersonal
} 
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')

const Usuario = require('../models/usuario');
const Personal = require('../models/personal');
const TipoUsuario = require('../models/tipousuario');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarUsuario = (req, res) => {
    Usuario.find({}).exec((err, data) => {
        TipoUsuario.populate(data, {path: "id_tipo"}, (err) => {
            if (err) return res.json({
                status: 500,
                mensaje: "Error en la peticion"
            })
        })
        Personal.populate(data, {path: "id_personal"}, (err) => {
            if (err) return res.json({
                status: 500,
                mensaje: "Error en la peticion"
            })
        })
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        
        //contar la cantidad de registros
        Usuario.countDocuments({}, (err, total) => {

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

let crearUsuario = (req, res) => {

    //obtenemos el cuerpo del formulario

    const {user, password, estado, google, rol, id_personal} = req.body

    //obtenemos los datos del formulario para pasarlo al modelo
    
    const usuario = new Usuario({
        user: user,
        password: password,
        estado: estado,
        google: google,
        rol: rol,
        id_personal: id_personal
    })

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)
    
    //guardamos en mongodb
    
    usuario.save((err, data) => {
        if (err) {
            return res.json({
                status: 400,
                mensaje: "Error al almacenar el usuario",
                err
            });
        }
        
        res.json({
            status: 200,
            data,
            mensaje: "El usuario ha sido creado con exito"
        });
    })
}


/*=============================================
=            PETICIONES PUT            =
=============================================*/

const editarUsuario = async(req, res) => {
    
    //capturamos el id del usuario que queremos actualizar
    
    const {id} = req.params
    // const id = req.params.id
    
    //obtenemos el cuerpo del formulario
    
    const { _id, password, google, ...resto} = req.body
    
    //validar contra la base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findOneAndUpdate(id, resto)

    res.json({
        mensaje: "put Api-usuarioPut",
        usuario
    })



    // //VALIDAMOS QUE EL USUARIO EXISTA

    // usuario.findById(id, (err, data) => {
    //     //validamos que no ocurra error en el proceso
    //     if (err) {
    //         return res.json({
    //             status: 500,
    //             mensaje: "Error en el servidor",
    //             err
    //         })
    //     }
    //     //si el usuario no existe
    //     if (!data) {
    //         return res.json({
    //             status: 400,
    //             mensaje: "El usuario no existe en la base de datos",
    //             err
    //         })
            
    //     }
    
    //     //ACTUALIZAR LOS REGISTROS

    //     const cambiarRegistrosBD = (id, body) => {
    //         return new Promise((resolve, reject) => {
    //             let datosUsuario = {
    //                 user: body.usu,
    //                 password: body.pass,
    //                 rol: body.rol,
    //                 id_personal: body.id_personal
    //             }
        
    //             //Acualizamos en mongodb
    //             Usuario.findByIdAndUpdate(id, datosUsuario, {new: true, runValidators: true}, (err, data) => {
    //                 if (err) {
    //                     let respuesta = {
    //                         res: res,
    //                         error: err
    //                     }

    //                     reject(respuesta)
    //                 }
    //                 let respuesta = {
    //                     res: res,
    //                     data: data
    //                 }

    //                 resolve(respuesta)
    //             })
    //         })
    //     }
    //     //validacion
    //     cambiarRegistrosBD(id, body).then(respuesta => {
    //         respuesta["res"].json({
    //             status: 200,
    //             data: respuesta["data"],
    //             mensaje: "El usuario ha sido actualizado con éxito"
    //         })
    //     }).catch(respuesta => {
    //         respuesta["res"].json({
    //             status: 400,
    //             err: respuesta["err"],
    //             mensaje: "Error al actualizar el usuario"
    //         })
            
    //     })

    // })
}



/*=============================================
=            PETICION DELETE            =
=============================================*/

let eliminarUsuario = (req, res) => {
    //capturamos el id del usuario que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL USUARIO EXISTA

    Usuario.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el usuario no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El usuario no existe en la base de datos",
                err
            })
            
        }

        //borramos el registro en MongoDB
        Usuario.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el usuario",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El usuario ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarUsuario,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
} 
//administrador de carpetas y archivos en nodejs
const fs = require('fs')
const Comentario = require('../models/comentario');
const Articulo = require('../models/articulo');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarComentario = (req, res) => {
    Comentario.find({}).exec((err, data) => {
        Articulo.populate(data, {path: "id_articulo"}, (err) => {
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
        Comentario.countDocuments({}, (err, total) => {

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

let crearComentario = (req, res) => {

    //obtenemos el cuerpo del formulario

    let body = req.body

    //preguntamos si viene un archivo

    if (!req.files) {

        // let imagenDefecto = ""

        // //obtenemos los datos del formulario para pasarlo al modelo
        
        // let comentario = new Comentario({
        //     autor: body.autor,
        //     foto_autor: `${nombre}.${extension}`,
        //     fecha: body.fecha,
        //     hora: body.hora,
        //     comentario: body.comentario,
        //     id_articulo: body.id_articulo
        // })

        // //guardamos en mongodb
        
        // comentario.save((err, data) => {
        //     if (err) {
        //         return res.json({
        //             status: 400,
        //             mensaje: "Error al almacenar el comentario",
        //             err
        //         })
        //     }

        //     res.json({
        //         status: 200,
        //         data,
        //         mensaje: "El comentario ha sido creado con exito"
        //     })
        // })

        return res.json({
            status: 500,
            mensaje: "La imagen no puede ir vacía"
        })
    }

    //capturamos el archivo

    let archivo = req.files.foto_autor
    
    //validamos la extension del archivo
    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
        res.json({
            status: 400,
            mensaje: "La imagen debe ser formato JPEG o PNG"
        })
    }
    
    //validamos el tamaño del archivo
    
    if(archivo.size > 2000000){
        res.json({
            status: 400,
            mensaje: "La imagen debe ser menor a 2MB"
        })
    }

    //cambiar nombre al archivo

    let nombre = Math.floor(Math.random()*10000)

        //capturar la extension del archivo
    let extension = archivo.name.split('.').pop()

        //movemos el archivo a la carpeta
    archivo.mv(`./images/comentarios/${nombre}.${extension}`, err => {
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }

        //obtenemos los datos del formulario para pasarlo al modelo
        
        let comentario = new Comentario({
            autor: body.autor,
            foto_autor: `${nombre}.${extension}`,
            fecha: body.fecha,
            hora: body.hora,
            comentario: body.comentario,
            id_articulo: body.id_articulo
        })

        //guardamos en mongodb
        
        comentario.save((err, data) => {
            if (err) {
                return res.json({
                    status: 400,
                    mensaje: "Error al almacenar el comentario",
                    err
                })
            }

            res.json({
                status: 200,
                data,
                mensaje: "El comentario ha sido creado con exito"
            })
        })
    })
}



/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarComentario = (req, res) => {
    
    //capturamos el id del comentario que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL COMENTARIO EXISTA

    Comentario.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el comentario no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El comentario no existe en la base de datos",
                err
            })
            
        }

        let rutaImagen = data.foto_autor


        //VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
    
        let validarCambioArchivo = (req, rutaImagen) => {
            return new Promise((resolve, reject) => {
                if (req.files) {
                    
                    //capturamos el archivo nuevo

                    let archivo = req.files.foto_autor
                    
                    //validamos la extension del archivo
                    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){

                        let respuesta = {
                            res: res,
                            mensaje: "La imagen debe ser formato JPEG o PNG"
                        }
                        reject(respuesta)
                    }
                    
                    //validamos el tamaño del archivo
                    
                    if(archivo.size > 2000000){

                        let respuesta = {
                            res: res,
                            mensaje: "La imagen debe ser menor a 2MB"
                        }
                        reject(respuesta)
                    }
                    
                    //cambiar nombre al archivo
                    
                    let nombre = Math.floor(Math.random()*10000)
                    
                    //capturar la extension del archivo
                    let extension = archivo.name.split('.').pop()
                    
                    //movemos el archivo a la carpeta
                    archivo.mv(`./images/comentarios/${nombre}.${extension}`, err => {
                        if (err) {
                            let respuesta = {
                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta)
                        }

                        //borramos la antigua imagen
                        if(fs.existsSync(`./images/comentarios/${rutaImagen}`)){
                            fs.unlinkSync(`./images/comentarios/${rutaImagen}`)
                        }

                        //damos valor a la nueva imagen
                        rutaImagen = `${nombre}.${extension}`
                        
                        resolve(rutaImagen)
                    })

                }
            })
        }
    
        //ACTUALIZAR LOS REGISTROS

        let cambiarRegistrosBD = (id, body, rutaImagen) => {
            return new Promise((resolve, reject) => {
                let datosComentario = {
                    autor: body.autor,
                    foto_autor: rutaImagen,
                    fecha: body.fecha,
                    hora: body.hora,
                    comentario: body.comentario,
                    id_articulo: body.id_articulo
                }
        
                //Acualizamos en mongodb
                Comentario.findByIdAndUpdate(id, datosComentario, {new: true, runValidators: true}, (err, data) => {
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
        validarCambioArchivo(req, rutaImagen).then((rutaImagen) => {
            cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {
                respuesta["res"].json({
                    status: 200,
                    data: respuesta["data"],
                    mensaje: "El comentario ha sido actualizado con éxito"
                })
            }).catch(respuesta => {
                respuesta["res"].json({
                    status: 400,
                    err: respuesta["err"],
                    mensaje: "Error al actualizar el comentario"
                })
            })
        }).catch(respuesta => {
            respuesta["res"].json({
                status: 400,
                mensaje: respuesta["mensaje"]
            })
        })
    })
}



/*=============================================
=            PETICION DELETE            =
=============================================*/

let eliminarComentario = (req, res) => {

    //capturamos el id del comentario que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL COMENTARIO EXISTA

    Comentario.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el comentario no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El comentario no existe en la base de datos",
                err
            })
            
        }

         //borramos la antigua imagen
         if(fs.existsSync(`./images/comentarios/${data.imagen}`)){
            fs.unlinkSync(`./images/comentarios/${data.imagen}`)
        }

        //borramos el registro en MongoDB
        Comentario.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el comentario",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El comentario ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarComentario,
    crearComentario,
    editarComentario,
    eliminarComentario
} 
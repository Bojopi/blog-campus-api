//administrador de carpetas y archivos en nodejs
const fs = require('fs')
const path = require('path')
const Recurso = require('../models/recurso');
const Categoria = require('../models/categoria');
const cloudinary = require('cloudinary').v2
// cloudinary.config( process.env.CLOUDINARY_URL )


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarRecurso = (req, res) => {
    Recurso.find({}).exec((err, data) => {
        Categoria.populate(data, {path: "id_categoria"}, (err) => {
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
        Recurso.countDocuments({}, (err, total) => {

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

let crearRecurso = (req, res) => {

    //obtenemos el cuerpo del formulario
    
    let body = req.body
    
    //preguntamos si viene un archivo
    
    if (!req.files) {
        return res.json({
            status: 500,
            mensaje: "La imagen no puede ir vacía"
        })
    }

    //capturamos el archivo

    const { img } = req.files
    
    //validamos la extension del archivo
    if(img.mimetype != 'image/jpeg' && img.mimetype != 'image/png'){
        res.json({
            status: 400,
            mensaje: "La imagen debe ser formato JPEG o PNG"
        })
    }
    
    //validamos el tamaño del archivo
    
    if(img.size > 2000000){
        res.json({
            status: 400,
            mensaje: "La imagen debe ser menor a 2MB"
        })
    }

    //cambiar nombre al archivo

    let nombre = Math.floor(Math.random()*10000)

        //capturar la extension del archivo
    let extension = img.name.split('.').pop()

    //creamos el nombre del archivo
    let nombreArchivo = `${nombre}.${extension}`

    //creamos la ruta del nuevo archivo
    const uploadPath = path.join(__dirname, '/../images/recursos/', nombreArchivo)

        //movemos el archivo a la carpeta
    // img.mv(uploadPath, err => {
    //     if (err) {
    //         return res.json({
    //             status: 500,
    //             mensaje: "Error al guardar la imagen",
    //             err
    //         })
    //     }
    cloudinary.uploader.upload(uploadPath, (err) => {
        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen"
            })
        }
    })

        //obtenemos los datos del formulario para pasarlo al modelo
        
        let recurso = new Recurso({
            titulo: body.titulo,
            descripcion: body.descripcion,
            img: nombreArchivo,
            video: body.video,
            enlace: body.enlace,
            id_categoria: body.id_categoria
        })

        //guardamos en mongodb
        
        recurso.save((err, data) => {
            if (err) {
                return res.json({
                    status: 400,
                    mensaje: "Error al almacenar el recurso",
                    err
                })
            }

            res.json({
                status: 200,
                data,
                mensaje: "El recurso ha sido creado con exito"
            })
        })
    // })
}



/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarRecurso = (req, res) => {
    
    //capturamos el id del recurso que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL RECURSO EXISTA

    Recurso.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el articulo no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El recurso no existe en la base de datos",
                err
            })
            
        }

        let rutaImagen = data.img


        //VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
    
        let validarCambioArchivo = (req, rutaImagen) => {
            return new Promise((resolve, reject) => {
                if (req.files) {
                    
                    //capturamos el archivo nuevo

                    let archivo = req.files.img
                    
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
                    archivo.mv(`./images/recursos/${nombre}.${extension}`, err => {
                        if (err) {
                            let respuesta = {
                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta)
                        }

                        //borramos la antigua imagen
                        if(fs.existsSync(`./images/recursos/${rutaImagen}`)){
                            fs.unlinkSync(`./images/recursos/${rutaImagen}`)
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
                let datosRecurso = {
                    titulo: body.titulo,
                    descripcion: body.descripcion,
                    img: rutaImagen,
                    video: body.video,
                    enlace: body.enlace,
                    id_categoria: body.id_categoria
                }
        
                //Acualizamos en mongodb
                
                Recurso.findByIdAndUpdate(id, datosRecurso, {new: true, runValidators: true}, (err, data) => {
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
                    mensaje: "El recurso ha sido actualizado con éxito"
                })
            }).catch(respuesta => {
                respuesta["res"].json({
                    status: 400,
                    err: respuesta["err"],
                    mensaje: "Error al actualizar el recurso"
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

let eliminarRecurso = (req, res) => {
    //capturamos el id del articulo que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL ARTICULO EXISTA

    Recurso.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //si el articulo no existe
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El recurso no existe en la base de datos",
                err
            })
            
        }

         //borramos la antigua imagen
         if(fs.existsSync(`./images/recursos/${data.imagen}`)){
            fs.unlinkSync(`./images/recursos/${data.imagen}`)
        }

        //borramos el registro en MongoDB
        Recurso.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el recurso",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El recurso ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarRecurso,
    crearRecurso,
    editarRecurso,
    eliminarRecurso
} 
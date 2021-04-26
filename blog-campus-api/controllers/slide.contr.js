//administrador de carpetas y archivos en nodejs
const fs = require('fs')
const Slide = require('../models/slide.mod');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarSlide = (req, res) => {
    Slide.find({}).exec((err, data) => {
        if (err) return res.json({
            status: 500,
            mensaje: "Error en la peticion"
        })

        
        //contar la cantidad de registros
        Slide.countDocuments({}, (err, total) => {

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

let crearSlide = (req, res) => {

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

    let archivo = req.files.archivo
    
    //validamos la extension del archivo
    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image.png'){
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
    archivo.mv(`./images/slides/${nombre}.${extension}`, err => {
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }

        //obtenemos los datos del formulario para pasarlo al modelo
        
        let slide = new Slide({
            imagen: `${nombre}.${extension}`,
            titulo: body.titulo,
            descripcion: body.descripcion
        })
    
        //guardamos en mongodb
        
        slide.save((err, data) => {
            if (err) {
                return res.json({
                    status: 400,
                    mensaje: "Error al almacenar el Slide",
                    err
                })
            }
    
            res.json({
                status: 200,
                data,
                mensaje: "El Slide ha sido creado con exito"
            })
        })
    })
}


/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarSlide = (req, res) => {
    
    //capturamos el id del slide que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL SLIDE EXISTA

    Slide.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //validamos que el slide exista
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El slide no existe en la base de datos",
                err
            })
            
        }

        let rutaImagen = data.imagen


        //VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
    
        let validarCambioArchivo = (req, rutaImagen) => {
            return new Promise((resolve, reject) => {
                if (req.files) {
                    
                    //capturamos el archivo nuevo

                    let archivo = req.files.archivo
                    
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
                    archivo.mv(`./images/slides/${nombre}.${extension}`, err => {
                        if (err) {
                            let respuesta = {
                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta)
                        }

                        //borramos la antigua imagen
                        if(fs.existsSync(`./images/slides/${rutaImagen}`)){
                            fs.unlinkSync(`./images/slides/${rutaImagen}`)
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
                let datosSlide = {
                    imagen: rutaImagen,
                    titulo: body.titulo,
                    descripcion: body.descripcion
                }
        
                //Acualizamos en mongodb
                Slide.findByIdAndUpdate(id, datosSlide, {new: true, runValidators: true}, (err, data) => {
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
        //sincronizar las promesas
        validarCambioArchivo(req, rutaImagen).then((rutaImagen) => {
            cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {
                respuesta["res"].json({
                    status: 200,
                    data: respuesta["data"],
                    mensaje: "El slide ha sido actualizado con éxito"
                })
            }).catch(respuesta => {
                respuesta["res"].json({
                    status: 400,
                    err: respuesta["err"],
                    mensaje: "Error al actualizar el slide"
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

let eliminarSlide = (req, res) => {
    //capturamos el id del slide que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL SLIDE EXISTA

    Slide.findById(id, (err, data) => {
        //validamos que no ocurra error en el proceso
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //validamos que el slide exista
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El slide no existe en la base de datos",
                err
            })
            
        }

        //borramos la antigua imagen
        if(fs.existsSync(`./images/slides/${data.imagen}`)){
            fs.unlinkSync(`./images/slides/${data.imagen}`)
        }

        //borramos el registro en MongoDB
        Slide.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el registro",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El slide ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarSlide,
    crearSlide,
    editarSlide,
    eliminarSlide
} 
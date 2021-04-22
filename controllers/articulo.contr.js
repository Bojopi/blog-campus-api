//administrador de carpetas y archivos en nodejs
const fs = require('fs')
const Articulo = require('../models/articulo');
const Personal = require('../models/personal');


/*=============================================
=            PETICIONES GET            =
=============================================*/
let mostrarArticulo = (req, res) => {
    Articulo.find({}).exec((err, data) => {
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



/*=============================================
=            PETICIONES POST            =
=============================================*/

let crearArticulo = (req, res) => {

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

    let archivo = req.files.img
    // console.log(req.files.img)
    // return
    
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
    archivo.mv(`./images/articulos/${nombre}.${extension}`, err => {
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }

        //obtenemos los datos del formulario para pasarlo al modelo
        
        let articulo = new Articulo({
            titulo: body.titulo,
            introduccion: body.introduccion,
            contenido: body.contenido,
            fecha: body.fecha,
            img: `${nombre}.${extension}`,
            id_personal: body.id_personal
        })

        //guardamos en mongodb
        
        articulo.save((err, data) => {
            if (err) {
                return res.json({
                    status: 400,
                    mensaje: "Error al almacenar el articulo",
                    err
                })
            }

            res.json({
                status: 200,
                data,
                mensaje: "El articulo ha sido creado con exito"
            })
        })
    })
}



/*=============================================
=            PETICIONES PUT            =
=============================================*/

let editarArticulo = (req, res) => {
    
    //capturamos el id del articulo que queremos actualizar

    let id = req.params.id

    //obtenemos el cuerpo del formulario

    let body = req.body

    //VALIDAMOS QUE EL ARTICULO EXISTA

    Articulo.findById(id, (err, data) => {
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
                mensaje: "El articulo no existe en la base de datos",
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
                        if(fs.existsSync(`./images/articulos/${rutaImagen}`)){
                            fs.unlinkSync(`./images/articulos/${rutaImagen}`)
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
                let datosArticulo = {
                    titulo: body.titulo,
                    introduccion: body.introduccion,
                    contenido: body.contenido,
                    fecha: body.fecha,
                    img: rutaImagen,
                    id_personal: body.id_personal
                }
        
                //Acualizamos en mongodb
                Personal.findByIdAndUpdate(id, datosArticulo, {new: true, runValidators: true}, (err, data) => {
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
                    mensaje: "El articulo ha sido actualizado con éxito"
                })
            }).catch(respuesta => {
                respuesta["res"].json({
                    status: 400,
                    err: respuesta["err"],
                    mensaje: "Error al actualizar el articulo"
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

let eliminarArticulo = (req, res) => {
    //capturamos el id del articulo que queremos eliminar

    let id = req.params.id

    //VALIDAMOS QUE EL ARTICULO EXISTA

    Articulo.findById(id, (err, data) => {
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
                mensaje: "El articulo no existe en la base de datos",
                err
            })
            
        }

         //borramos la antigua imagen
         if(fs.existsSync(`./images/articulos/${data.imagen}`)){
            fs.unlinkSync(`./images/articulos/${data.imagen}`)
        }

        //borramos el registro en MongoDB
        Articulo.findByIdAndDelete(id, (err, data) => {
            if(err) {
                return res.json({
                    status: 500,
                    mensaje: "Error al borrar el articulo",
                    err
                })
            }

            res.json({
                status: 200,
                mensaje: "El articulo ha sido borrado correctamente"
            })

        })

    })
}





//exportar las funciones del controlador
module.exports = {
    mostrarArticulo,
    crearArticulo,
    editarArticulo,
    eliminarArticulo
} 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        //PATHS
        this.personalPath = '/api/personal'
        this.categoriaPath = '/api/categoria'
        this.tipoPath = '/api/tipo'
        this.usuarioPath = '/api/usuario'
        this.articuloPath = '/api/articulo'
        this.comentarioPath = '/api/comentario'
        this.recursoPath = '/api/recurso'

        //Middlewares
        this.middlewares()

        //Rutas de mi aplicacion
        this.routes()
    }

    
    /*=============================================
    =            MIDDLEWARES            =
    =============================================*/
    middlewares(){
        //FileUpload
            //default options express-fileupload
        this.app.use(fileUpload())

        //Body Parser
            //parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({limit: '10mb', extended: true }))

            //parse application/json
        this.app.use(bodyParser.json({limit: '10mb', extended: true }))

        //CORS
        this.app.use( cors() )

        //Directorio Público
        this.app.use( express.static('public') )
    }        

    /*=============================================
    =            ROUTES            =
    =============================================*/
    routes(){
        //PERSONAL
        this.app.use(this.personalPath,require('../routes/personal.rout'))
        
        //CATEGORIA
        this.app.use(this.categoriaPath,require('../routes/categoria.rout'))

        //TIPO USUARIO
        this.app.use(this.tipoPath,require('../routes/tipousuario.rout'))

        //USUARIO
        this.app.use(this.usuarioPath,require('../routes/usuario.rout'))

        //ARTICULO
        this.app.use(this.articuloPath,require('../routes/articulo.rout'))

        //COMENTARIO
        this.app.use(this.comentarioPath,require('../routes/comentario.rout'))

        //RECURSO
        this.app.use(this.recursoPath,require('../routes/recurso.rout'))
        
    }

    listen(){
        //SALIDA DEL PUERTO HTTP
        this.app.listen(this.port, () => {
            console.log(`Habilitado el puerto: ${this.port}`)
        })
    }

}

module.exports = Server;
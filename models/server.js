const express = require('express');
const cors = require('cors');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        //Middlewares
        this.middlewares()

        //Rutas de mi aplicacion
        this.routes()
    }

    
    /*=============================================
    =            MIDDLEWARES            =
    =============================================*/
    middlewares(){
        //CORS
        this.app.use( cors() )

        //Directorio Público
        this.app.use( express.static('public') )
    }        

    /*=============================================
    =            ROUTES            =
    =============================================*/
    routes(){
        
    }

    listen(){
        //SALIDA DEL PUERTO HTTP
        this.app.listen(this.port, () => {
            console.log(`Habilitado el puerto: ${this.port}`)
        })
    }

}

module.exports = Server;
const express = require('express');
// const app = express()

class Server {
    constructor(){
        this.app = express()
    }

    
    /*=============================================
    =            ROUTES            =
    =============================================*/
    
    
    
    
    routes(){
        this.app.get('/', (req, res) => {

        })
    }

}

module.exports = Server;
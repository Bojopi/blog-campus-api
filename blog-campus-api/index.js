// require('./config')
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2
//CLOUDINARY
cloudinary.config({
    cloud_name: 'blogcampusapiutepsa',
    api_key: '621957746813365',
    api_secret: 'OB9BUA6HfHp6JOQL9Iuc2rZ8H6o'
})

const Server = require('./models/server');


const app = express()
const server = new Server()


/*=============================================
=               MIDDLEWARS                    =
=============================================*/

//MIDDLEWARE PARA BODY PARSER

// //parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true }))

// //parse application/json
// app.use(bodyParser.json({limit: '10mb', extended: true }))


//MIDDLEWARE PARA FILE UPLOAD
//default options express-fileupload
// app.use(fileUpload())

//MIDDLEWARE PARA USETEMPFILE OPTION
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));

//MIDDLEWARE PARA CLOUDINARY
// cloudinary.config( {
//     cloud_name: 'blogcampusapiutepsa',
//     api_key: '621957746813365',
//     api_secret: 'OB9BUA6HfHp6JOQL9Iuc2rZ8H6o'
// } )

//MIDDLEWARE EN EXPRESS
// app.use((req, res, next) => {
//     //Dominio que tengan acceso
//     res.setHeader('Access-Control-Allow-Origin', '*')

//     //Métodos de solicitud que deseas permitir
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

//     //Encabezados que permites
//     res.setHeader('Access-Control-Allow-Headers', '*')
// })

/*=====        End of MIDDLEWARS       ======*/






/*=============================================
=      DESAPROBACIONES DE MONGOOSE            =
=============================================*/
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



//IMPORTAR LAS RUTAS

// app.use(require('./routes/personal.rout'))
// app.use(require('./routes/categoria.rout'))
// app.use(require('./routes/tipousuario.rout'))
// app.use(require('./routes/usuario.rout'))
// app.use(require('./routes/articulo.rout'))
// app.use(require('./routes/comentario.rout'))
// app.use(require('./routes/recurso.rout'))

//CONEXION A LA BASE DE DATOS
//mongoose.connect('mongodb://localhost:27017/apirest', {
mongoose.connect('mongodb+srv://admin:12345678Admin@apirestmongoblog.acoc2.mongodb.net/apirest?retryWrites=true&w=majority', {
//mongoose.connect('mongodb+srv://admin:12345678Admin@cluster0.yhpme.mongodb.net/apirest?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err
    console.log("Conectado a la BD")
})



server.listen()
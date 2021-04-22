require('./config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express()

//MIDDLEWARE PARA BODY PARSER

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }))

//parse application/json
app.use(bodyParser.json({limit: '10mb', extended: true }))


//MIDDLEWARE PARA FILE UPLOAD
//default options express-fileupload
app.use(fileUpload())



/*=============================================
=      DESAPROBACIONES DE MONGOOSE            =
=============================================*/
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



//IMPORTAR LAS RUTAS

app.use(require('./routes/personal.rout'))
// app.use(require('./routes/galeria.rout'))
// app.use(require('./routes/articulo.rout'))

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

//SALIDA DEL PUERTO HTTP
app.listen(process.env.PORT, () => {
    console.log(`Habilitado el puerto: ${process.env.PORT}`)
})
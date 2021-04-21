const express = require('express');

const app = express()

const Galeria = require('../controllers/galeria.contr');

//creamos las rutas

app.get('/mostrar-galeria', Galeria.mostrarGaleria)

//exportar la ruta
module.exports = app
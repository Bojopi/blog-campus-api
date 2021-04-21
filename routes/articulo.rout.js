const express = require('express');

const app = express()

const Articulo = require('../controllers/articulo.contr');

//creamos las rutas

app.get('/mostrar-articulo', Articulo.mostrarArticulo)

//exportar la ruta
module.exports = app
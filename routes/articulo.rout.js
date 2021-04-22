const express = require('express');

const app = express()

const Articulo = require('../controllers/articulo.contr');

//creamos las rutas

app.get('/mostrar-articulo', Articulo.mostrarArticulo)

app.post('/crear-articulo', Articulo.crearArticulo)

app.put('/editar-articulo/:id', Articulo.editarArticulo)

app.delete('/eliminar-articulo/:id', Articulo.eliminarArticulo)

//exportar la ruta
module.exports = app
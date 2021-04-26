const express = require('express');

const app = express()

const Categoria = require('../controllers/categoria.contr');

//creamos las rutas

app.get('/', Categoria.mostrarCategoria)

app.post('/crear-categoria', Categoria.crearCategoria)

app.put('/editar-categoria/:id', Categoria.editarCategoria)

app.delete('/eliminar-categoria/:id', Categoria.eliminarCategoria)

//exportar la ruta
module.exports = app
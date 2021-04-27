const express = require('express');

const app = express()

const Comentario = require('../controllers/comentario.contr');

//creamos las rutas

app.get('/', Comentario.mostrarComentario)

app.post('/crear-comentario', Comentario.crearComentario)

app.put('/editar-comentario/:id', Comentario.editarComentario)

app.delete('/eliminar-comentario/:id', Comentario.eliminarComentario)

//exportar la ruta
module.exports = app
const express = require('express');

const app = express()

const Slide = require('../controllers/slide.contr');

//creamos las rutas

app.get('/mostrar-slide', Slide.mostrarSlide)

app.post('/crear-slide', Slide.crearSlide)

app.put('/editar-slide/:id', Slide.editarSlide)

//exportar la ruta
module.exports = app
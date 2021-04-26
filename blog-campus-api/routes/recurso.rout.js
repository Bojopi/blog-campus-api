const express = require('express');

const app = express()

const Recurso = require('../controllers/recurso.contr');

//creamos las rutas

app.get('/', Recurso.mostrarRecurso)

app.post('/crear-recurso', Recurso.crearRecurso)

app.put('/editar-recurso/:id', Recurso.editarRecurso)

app.delete('/eliminar-recurso/:id', Recurso.eliminarRecurso)

//exportar la ruta
module.exports = app
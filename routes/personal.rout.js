const express = require('express');

const app = express()

const Personal = require('../controllers/personal.contr');

//creamos las rutas

app.get('/mostrar-personal', Personal.mostrarPersonal)

app.post('/crear-personal', Personal.crearPersonal)

app.put('/editar-personal/:id', Personal.editarPersonal)

app.delete('/eliminar-personal/:id', Personal.eliminarPersonal)

//exportar la ruta
module.exports = app
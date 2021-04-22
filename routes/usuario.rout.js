const express = require('express');

const app = express()

const Usuario = require('../controllers/usuario.contr');

//creamos las rutas

app.get('/mostrar-usuario', Usuario.mostrarUsuario)

app.post('/crear-usuario', Usuario.crearUsuario)

app.put('/editar-usuario/:id', Usuario.editarUsuario)

app.delete('/eliminar-usuario/:id', Usuario.eliminarUsuario)

//exportar la ruta
module.exports = app
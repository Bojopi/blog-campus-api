const express = require('express');

const app = express()

const TipoUsuario = require('../controllers/tipousuario.contr');

//creamos las rutas

app.get('/', TipoUsuario.mostrarTipoUsuario)

app.post('/crear-tipo', TipoUsuario.crearTipoUsuario)

app.put('/editar-tipo/:id', TipoUsuario.editarTipoUsuario)

app.delete('/eliminar-tipo/:id', TipoUsuario.eliminarTipoUsuario)

//exportar la ruta
module.exports = app
const express = require('express');
const { check } = require('express-validator')

const app = express()

const { esRolValido } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')
const Usuario = require('../controllers/usuario.contr');

//creamos las rutas

app.get('/', Usuario.mostrarUsuario)

app.post('/crear-usuario', [
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('rol').custom( esRolValido ),
    validarCampos
] ,Usuario.crearUsuario)

app.put('/editar-usuario/:id', Usuario.editarUsuario)

app.delete('/eliminar-usuario/:id', Usuario.eliminarUsuario)

//exportar la ruta
module.exports = app
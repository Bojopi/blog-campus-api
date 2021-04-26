const express = require('express');
const { check } = require('express-validator')

const app = express()

const { correoExiste } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')
const Personal = require('../controllers/personal.contr');

//creamos las rutas

app.get('/', Personal.mostrarPersonal)

app.post('/crear-personal', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( correoExiste ),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('telefono', 'El telefono es obligatorio').notEmpty(),
    validarCampos
] ,Personal.crearPersonal)

app.put('/editar-personal/:id', Personal.editarPersonal)

app.delete('/eliminar-personal/:id', Personal.eliminarPersonal)

//exportar la ruta
module.exports = app
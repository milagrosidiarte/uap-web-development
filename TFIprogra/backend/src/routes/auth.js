const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
// Este archivo define las rutas de autenticación para el registro, inicio de sesión y cierre de sesión.
// Utiliza el controlador de autenticación para manejar las solicitudes correspondientes.
const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const {
  obtenerConfiguraciones,
  actualizarConfiguraciones
} = require('../controllers/settingsController');

router.use(checkAuth);

router.get('/', obtenerConfiguraciones);
router.put('/', actualizarConfiguraciones);

module.exports = router;
// Este archivo define las rutas para manejar la configuración del usuario.
// Utiliza el controlador de configuración para obtener y actualizar las preferencias del usuario.
const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const { crearTablero, listarTableros, compartirTablero, eliminarTablero } = require('../controllers/boardsController');
const { obtenerUsuariosDelTablero } = require('../controllers/boardsController');

router.use(checkAuth); // protege todas las rutas siguientes

router.post('/', crearTablero);      // POST /api/boards
router.get('/', listarTableros);     // GET  /api/boards
router.post('/:boardId/share', compartirTablero);
router.delete('/:boardId', checkAuth, eliminarTablero)


module.exports = router;
// Este archivo define las rutas para manejar tableros.
// Utiliza el controlador de tableros para crear y listar tableros.
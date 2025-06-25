const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const { crearTablero, listarTableros, compartirTablero } = require('../controllers/boardsController');

router.use(checkAuth); // protege todas las rutas siguientes

router.post('/', crearTablero);      // POST /api/boards
router.get('/', listarTableros);     // GET  /api/boards
router.post('/:boardId/share', compartirTablero);


module.exports = router;
// Este archivo define las rutas para manejar tableros.
// Utiliza el controlador de tableros para crear y listar tableros.
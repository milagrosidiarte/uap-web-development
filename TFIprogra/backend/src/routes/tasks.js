const express = require('express');
const router = express.Router({ mergeParams: true }); // para acceder a :boardId
const checkAuth = require('../middlewares/checkAuth');
const { crearTarea, listarTareas, editarTarea, toggleTarea } = require('../controllers/tasksController');

router.use(checkAuth); // proteger todo

router.post('/:boardId/tasks', crearTarea);
router.get('/:boardId/tasks', listarTareas);
router.put('/tasks/:taskId', editarTarea);
router.patch('/tasks/:taskId/toggle', toggleTarea);

module.exports = router;
// Este archivo define las rutas para manejar las tareas dentro de un tablero específico.
// Utiliza el middleware de autenticación para proteger las rutas y asegurar que solo usuarios autenticados
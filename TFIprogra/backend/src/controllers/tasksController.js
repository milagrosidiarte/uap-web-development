const db = require('../db/database');

// Verifica si el usuario tiene permiso en el tablero
function tienePermiso(userId, boardId) {
  const result = db.prepare(`
    SELECT role FROM permissions
    WHERE user_id = ? AND board_id = ?
  `).get(userId, boardId);
  return result;
}

// Crear una tarea dentro de un tablero
const crearTarea = (req, res) => {
  const userId = req.user.id;
  const { boardId } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Falta el contenido de la tarea' });

  const permiso = tienePermiso(userId, boardId);
  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permisos para agregar tareas a este tablero' });
  }

  const result = db.prepare(`
    INSERT INTO tasks (content, board_id) VALUES (?, ?)
  `).run(content, boardId);

  res.status(201).json({ message: 'Tarea creada', taskId: result.lastInsertRowid });
};

// Listar tareas de un tablero
const listarTareas = (req, res) => {
  const userId = req.user.id;
  const { boardId } = req.params;

  const permiso = tienePermiso(userId, boardId);
  if (!permiso) return res.status(403).json({ error: 'Sin acceso a este tablero' });

  const tasks = db.prepare(`
    SELECT id, content, completed, created_at
    FROM tasks
    WHERE board_id = ?
    ORDER BY created_at DESC
  `).all(boardId);

  res.json(tasks);
};

const editarTarea = (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Falta contenido nuevo' });

  // Buscar la tarea y su board
  const tarea = db.prepare(`
    SELECT id, board_id FROM tasks WHERE id = ?
  `).get(taskId);

  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });

  // Verificar permisos
  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, tarea.board_id);

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permisos para editar esta tarea' });
  }

  // Actualizar la tarea
  db.prepare(`
    UPDATE tasks SET content = ? WHERE id = ?
  `).run(content, taskId);

  res.json({ message: 'Tarea actualizada' });
};
// que solo los usuarios con permisos de propietario o editor pueden crear tareas.
// Además, se verifica que el usuario tenga acceso al tablero antes de listar las tareas,

const toggleTarea = (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  // Buscar tarea y obtener el board_id
  const tarea = db.prepare(`
    SELECT id, board_id, completed FROM tasks WHERE id = ?
  `).get(taskId);

  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });

  // Verificar permisos del usuario sobre el tablero
  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, tarea.board_id);

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permisos para modificar esta tarea' });
  }

  // Toggle del campo completed (0 ↔ 1)
  const nuevoEstado = tarea.completed ? 0 : 1;

  db.prepare(`
    UPDATE tasks SET completed = ? WHERE id = ?
  `).run(nuevoEstado, taskId);

  res.json({ message: 'Tarea actualizada', completed: nuevoEstado });
};
// asegurando que solo los usuarios con permisos adecuados puedan interactuar con las tareas.

module.exports = { crearTarea, listarTareas, editarTarea, toggleTarea };

// de autenticación pueden acceder a estas rutas.
// Las tareas se crean y listan dentro del contexto de un tablero específico, asegurando que
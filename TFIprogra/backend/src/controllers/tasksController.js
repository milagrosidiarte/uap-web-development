const db = require('../db/database')

const crearTarea = (req, res) => {
  const userId = req.user.id
  const { boardId } = req.params
  const { content } = req.body

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Contenido requerido' })
  }

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, boardId)

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permiso para crear tareas' })
  }

  const stmt = db.prepare(`
    INSERT INTO tasks (board_id, content, completed, created_at)
    VALUES (?, ?, 0, datetime('now'))
  `)
  const result = stmt.run(boardId, content)

  res.status(201).json({ id: result.lastInsertRowid, content, completed: 0 })
}

const listarTareas = (req, res) => {
  const userId = req.user.id
  const { boardId } = req.params
  const { completed, q, limit = 10, offset = 0 } = req.query

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, boardId)

  if (!permiso) {
    return res.status(403).json({ error: 'Sin acceso a este tablero' })
  }

  let query = `
    SELECT id, content, completed, created_at
    FROM tasks
    WHERE board_id = ?
  `
  const params = [boardId]

  if (completed === '0' || completed === '1') {
    query += ' AND completed = ?'
    params.push(parseInt(completed))
  }

  if (q && q.trim() !== '') {
    query += ' AND content LIKE ?'
    params.push(`%${q}%`)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(parseInt(limit), parseInt(offset))

  const tasks = db.prepare(query).all(...params)

  // Contar total de tareas sin paginación
  let countQuery = `
    SELECT COUNT(*) as total
    FROM tasks
    WHERE board_id = ?
  `
  const countParams = [boardId]

  if (completed === '0' || completed === '1') {
    countQuery += ' AND completed = ?'
    countParams.push(parseInt(completed))
  }

  if (q && q.trim() !== '') {
    countQuery += ' AND content LIKE ?'
    countParams.push(`%${q}%`)
  }

  const total = db.prepare(countQuery).get(...countParams).total

  res.json({ tasks, total })
}

const editarTarea = (req, res) => {
  const userId = req.user.id
  const { taskId } = req.params
  const { content } = req.body

  const tarea = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(taskId)
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, tarea.board_id)

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permiso para editar tareas' })
  }

  db.prepare(`UPDATE tasks SET content = ? WHERE id = ?`).run(content, taskId)
  res.json({ message: 'Tarea actualizada' })
}

const toggleTarea = (req, res) => {
  const userId = req.user.id
  const { taskId } = req.params

  const tarea = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(taskId)
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, tarea.board_id)

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permiso para modificar tareas' })
  }

  const nuevoEstado = tarea.completed ? 0 : 1
  db.prepare(`UPDATE tasks SET completed = ? WHERE id = ?`).run(nuevoEstado, taskId)

  res.json({ id: tarea.id, completed: nuevoEstado })
}

const eliminarTarea = (req, res) => {
  const userId = req.user.id
  const { taskId } = req.params

  const tarea = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(taskId)
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, tarea.board_id)

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permiso para eliminar tareas' })
  }

  db.prepare(`DELETE FROM tasks WHERE id = ?`).run(taskId)
  res.json({ message: 'Tarea eliminada' })
}

const eliminarTareasCompletadas = (req, res) => {
  const userId = req.user.id
  const { boardId } = req.params

  const permiso = db.prepare(`
    SELECT role FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(userId, boardId)

  if (!permiso || (permiso.role !== 'owner' && permiso.role !== 'editor')) {
    return res.status(403).json({ error: 'Sin permiso para eliminar tareas' })
  }

  const stmt = db.prepare(`DELETE FROM tasks WHERE board_id = ? AND completed = 1`)
  const result = stmt.run(boardId)

  res.json({ message: `Se eliminaron ${result.changes} tareas completadas` })
}

module.exports = {
  crearTarea,
  listarTareas,
  editarTarea,
  toggleTarea,
  eliminarTarea,
  eliminarTareasCompletadas
}
// Este archivo contiene las funciones del controlador para manejar las tareas en un tablero específico.
// Incluye la lógica para crear, listar, editar, eliminar y alternar el estado de
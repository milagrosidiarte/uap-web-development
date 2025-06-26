const db = require('../db/database');

// Crear tablero
const crearTablero = (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) return res.status(400).json({ error: 'Falta el nombre del tablero' });

  const insertBoard = db.prepare(`
    INSERT INTO boards (name, owner_id) VALUES (?, ?)
  `);
  const result = insertBoard.run(name, userId);

  // Registrar al creador como "owner" en tabla permissions
  db.prepare(`
    INSERT INTO permissions (user_id, board_id, role) VALUES (?, ?, 'owner')
  `).run(userId, result.lastInsertRowid);

  res.status(201).json({ message: 'Tablero creado', boardId: result.lastInsertRowid });
};

// Listar tableros a los que el usuario tiene acceso
const listarTableros = (req, res) => {
  const userId = req.user.id;

  const boards = db.prepare(`
    SELECT b.id, b.name, p.role
    FROM boards b
    JOIN permissions p ON b.id = p.board_id
    WHERE p.user_id = ?
  `).all(userId);

  res.json(boards);
};

const compartirTablero = (req, res) => {
  const ownerId = req.user.id;
  const { boardId } = req.params;
  const { username, role } = req.body;

  if (!['editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido (usar editor o viewer)' });
  }

  // Verificar que el tablero pertenece al owner actual
  const tablero = db.prepare(`
    SELECT * FROM boards WHERE id = ? AND owner_id = ?
  `).get(boardId, ownerId);

  if (!tablero) {
    return res.status(403).json({ error: 'No sos el dueño del tablero' });
  }

  // Buscar al usuario por username
  const usuario = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `).get(username);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Evitar duplicar permisos
  const yaExiste = db.prepare(`
    SELECT * FROM permissions WHERE user_id = ? AND board_id = ?
  `).get(usuario.id, boardId);

  if (yaExiste) {
    return res.status(400).json({ error: 'Este usuario ya tiene acceso' });
  }

  // Insertar permiso
  db.prepare(`
    INSERT INTO permissions (user_id, board_id, role) VALUES (?, ?, ?)
  `).run(usuario.id, boardId, role);

  res.json({ message: 'Tablero compartido con éxito', sharedWith: username, role });
};

const eliminarTablero = (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  // Verificar que el usuario es el dueño
  const board = db.prepare('SELECT * FROM boards WHERE id = ? AND owner_id = ?')
    .get(boardId, userId);

  if (!board) {
    return res.status(403).json({ error: 'No sos el dueño del tablero' });
  }

  // Eliminar permisos, tareas y tablero
  db.prepare('DELETE FROM permissions WHERE board_id = ?').run(boardId);
  db.prepare('DELETE FROM tasks WHERE board_id = ?').run(boardId);
  db.prepare('DELETE FROM boards WHERE id = ?').run(boardId);

  res.json({ message: 'Tablero eliminado' });
};

module.exports = { crearTablero, listarTableros, compartirTablero, eliminarTablero };
// Este controlador maneja la creación y listado de tableros.
// Utiliza la base de datos para insertar nuevos tableros y recuperar los existentes,
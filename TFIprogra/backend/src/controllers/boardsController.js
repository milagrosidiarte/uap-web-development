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

module.exports = { crearTablero, listarTableros };
// Este controlador maneja la creación y listado de tableros.
// Utiliza la base de datos para insertar nuevos tableros y recuperar los existentes,
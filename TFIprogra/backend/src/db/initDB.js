const db = require('./database');

function initDatabase() {
  // Tabla de usuarios
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `).run();

  // Tabla de tableros
  db.prepare(`
    CREATE TABLE IF NOT EXISTS boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `).run();

  // Tabla de tareas
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      board_id INTEGER NOT NULL,
      FOREIGN KEY (board_id) REFERENCES boards(id)
    );
  `).run();

  // Tabla de permisos
  db.prepare(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      board_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner', 'editor', 'viewer')),
      UNIQUE(user_id, board_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (board_id) REFERENCES boards(id)
    );
  `).run();

  // Tabla de configuraciones por usuario
  db.prepare(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY,
      auto_refresh_interval INTEGER DEFAULT 30,
      mostrar_mayusculas INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `).run();

  // Asegurar que la columna modo_oscuro existe (por si la tabla ya fue creada)
  try {
    db.prepare(`ALTER TABLE user_settings ADD COLUMN modo_oscuro INTEGER DEFAULT 0`).run();
  } catch (e) {
  }

  console.log("✅ Base de datos inicializada");
}

module.exports = initDatabase;

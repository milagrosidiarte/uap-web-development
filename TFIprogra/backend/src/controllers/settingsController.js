const db = require('../db/database');

// Obtener configuración actual del usuario
const obtenerConfiguraciones = (req, res) => {
  const userId = req.user.id;

  let settings = db.prepare(`
    SELECT auto_refresh_interval, mostrar_mayusculas, modo_oscuro
    FROM user_settings
    WHERE user_id = ?
  `).get(userId);

  // Si no tiene configuración, crearla por defecto
  if (!settings) {
    db.prepare(`
      INSERT INTO user_settings (user_id) VALUES (?)
    `).run(userId);

    settings = { auto_refresh_interval: 30, mostrar_mayusculas: 0, modo_oscuro: 0 };
  }

  res.json(settings);
};

// Actualizar configuración
const actualizarConfiguraciones = (req, res) => {
  const userId = req.user.id;
  const { auto_refresh_interval, mostrar_mayusculas, modo_oscuro } = req.body;

  db.prepare(`
    INSERT INTO user_settings (user_id, auto_refresh_interval, mostrar_mayusculas, modo_oscuro)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      auto_refresh_interval = excluded.auto_refresh_interval,
      mostrar_mayusculas = excluded.mostrar_mayusculas,
      modo_oscuro = excluded.modo_oscuro
  `).run(userId, auto_refresh_interval ?? 30, mostrar_mayusculas ?? 0, modo_oscuro ?? 0);

  res.json({ message: 'Configuración actualizada' });
};

module.exports = {
  obtenerConfiguraciones,
  actualizarConfiguraciones
};

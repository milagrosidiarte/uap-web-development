const db = require('../db/database');

// Obtener configuración actual del usuario
const obtenerConfiguraciones = (req, res) => {
  const userId = req.user.id;

  let settings = db.prepare(`
    SELECT auto_refresh_interval, mostrar_mayusculas
    FROM user_settings
    WHERE user_id = ?
  `).get(userId);

  // Si no tiene configuración, crearla por defecto
  if (!settings) {
    db.prepare(`
      INSERT INTO user_settings (user_id) VALUES (?)
    `).run(userId);

    settings = { auto_refresh_interval: 30, mostrar_mayusculas: 0 };
  }

  res.json(settings);
};

// Actualizar configuración
const actualizarConfiguraciones = (req, res) => {
  const userId = req.user.id;
  const { auto_refresh_interval, mostrar_mayusculas } = req.body;

  db.prepare(`
    INSERT INTO user_settings (user_id, auto_refresh_interval, mostrar_mayusculas)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      auto_refresh_interval = excluded.auto_refresh_interval,
      mostrar_mayusculas = excluded.mostrar_mayusculas
  `).run(userId, auto_refresh_interval ?? 30, mostrar_mayusculas ?? 0);

  res.json({ message: 'Configuración actualizada' });
};

module.exports = {
  obtenerConfiguraciones,
  actualizarConfiguraciones
};

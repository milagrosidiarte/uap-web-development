const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
}

const register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username y password requeridos' });

  const hashed = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, hashed);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: 'Usuario ya existe' });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
  });

  res.json({ message: 'Login exitoso' });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
};

module.exports = { register, login, logout };
// Este controlador maneja el registro, inicio de sesión y cierre de sesión de usuarios.
// Utiliza bcrypt para el hashing de contraseñas y JWT para la autenticación.
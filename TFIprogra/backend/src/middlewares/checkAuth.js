const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

function checkAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = checkAuth;
// Este middleware verifica la autenticación del usuario mediante JWT.
// Si el token es válido, agrega la información del usuario a la solicitud y permite continuar.
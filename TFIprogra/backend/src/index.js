const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initDatabase = require('./db/initDB');
const authRoutes = require('./routes/auth');
const boardsRoutes = require('./routes/boards');
const tasksRoutes = require('./routes/tasks');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la base
initDatabase();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/boards', boardsRoutes);
app.use('/api', authRoutes);
app.use('/api/boards', tasksRoutes); // se asocia con /api/boards/:boardId/tasks
app.use('/api/settings', settingsRoutes);

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong 🏓' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

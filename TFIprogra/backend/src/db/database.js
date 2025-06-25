const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new Database(dbPath);

module.exports = db;
// Este módulo exporta una instancia de la base de datos SQLite3.
// Utiliza better-sqlite3 para una mejor performance y manejo de transacciones.
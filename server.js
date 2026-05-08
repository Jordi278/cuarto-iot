require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT || 3306
});

db.connect(err => {
  if (err) { console.error('Error BD:', err.message); return; }
  console.log('Conectado a MySQL');
  db.query(`CREATE TABLE IF NOT EXISTS lecturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperatura FLOAT,
    movimiento BOOLEAN,
    corriente FLOAT,
    led BOOLEAN,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, err => { if(err) console.error(err); });
});

// ESP32 envía datos
app.post('/api/datos', (req, res) => {
  const { temperatura, movimiento, corriente, led } = req.body;
  db.query(
    'INSERT INTO lecturas (temperatura, movimiento, corriente, led) VALUES (?,?,?,?)',
    [temperatura, movimiento, corriente, led],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

// Dashboard pide último dato
app.get('/api/datos/ultimo', (req, res) => {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 1', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0] || {});
  });
});

// Dashboard pide historial
app.get('/api/datos/historial', (req, res) => {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 20', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Servidor corriendo en puerto ${PORT}));
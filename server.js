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
    humedad FLOAT,
    movimiento BOOLEAN,
    corriente FLOAT,
    luz INT,
    led BOOLEAN,
    abanico BOOLEAN,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, err => {
    if (err) { console.error(err); return; }
    // Agregar columnas nuevas si la tabla ya existía
    db.query(`ALTER TABLE lecturas ADD COLUMN IF NOT EXISTS humedad FLOAT AFTER temperatura`, err => { if(err && !err.message.includes('Duplicate')) console.error(err); });
    db.query(`ALTER TABLE lecturas ADD COLUMN IF NOT EXISTS luz INT AFTER corriente`, err => { if(err && !err.message.includes('Duplicate')) console.error(err); });
    db.query(`ALTER TABLE lecturas ADD COLUMN IF NOT EXISTS abanico BOOLEAN AFTER led`, err => { if(err && !err.message.includes('Duplicate')) console.error(err); });
  });
});

app.post('/api/datos', (req, res) => {
  const { temperatura, humedad, movimiento, corriente, luz, led, abanico } = req.body;
  db.query(
    'INSERT INTO lecturas (temperatura, humedad, movimiento, corriente, luz, led, abanico) VALUES (?,?,?,?,?,?,?)',
    [temperatura, humedad ?? null, movimiento, corriente, luz ?? null, led, abanico ?? null],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

app.get('/api/datos/ultimo', (req, res) => {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 1', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0] || {});
  });
});

app.get('/api/datos/historial', (req, res) => {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 20', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

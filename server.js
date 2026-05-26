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

db.connect(function(err) {
  if (err) { console.error('Error BD:', err.message); return; }
  console.log('Conectado a MySQL');
  db.query('CREATE TABLE IF NOT EXISTS lecturas (id INT AUTO_INCREMENT PRIMARY KEY, temperatura FLOAT, humedad FLOAT, movimiento BOOLEAN, corriente FLOAT, luz FLOAT, led BOOLEAN, abanico BOOLEAN, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', function(err) {
    if (err) console.error(err);
  });
});

app.post('/api/datos', function(req, res) {
  var b = req.body;
  var temperatura = b.temperatura || null;
  var humedad = b.humedad || null;
  var movimiento = b.movimiento || null;
  var corriente = b.corriente || null;
  var luz = b.luz || null;
  var led = b.led || null;
  var abanico = b.abanico || null;
  db.query(
    'INSERT INTO lecturas (temperatura, humedad, movimiento, corriente, luz, led, abanico) VALUES (?,?,?,?,?,?,?)',
    [temperatura, humedad, movimiento, corriente, luz, led, abanico],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

app.get('/api/datos/ultimo', function(req, res) {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 1', function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0] || {});
  });
});

app.get('/api/datos/historial', function(req, res) {
  db.query('SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 20', function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.use(express.static('public'));

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Servidor corriendo en puerto ' + PORT);
});

// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || '';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite DB at', dbPath);
});

// Create contacts table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// API key middleware
app.use('/api', (req, res, next) => {
  const incomingKey = req.header('x-api-key');
  if (!incomingKey || incomingKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
  stmt.run(name, email, message, function (err) {
    if (err) {
      console.error('DB insert error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Your message has been received.' });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

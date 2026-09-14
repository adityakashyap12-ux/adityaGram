const express = require('express');
const { put } = require('@vercel/blob');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'AdityaGram')));
app.use(express.static(__dirname));

// Database Connect
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));
} else {
  console.log('MONGO_URI not found');
}

// Vercel Blob Upload - isse photo delete nahi hogi
const upload = multer(); // memory storage

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
    });
    res.json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for pages
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'AdityaGram', 'login.html'));
});
app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'AdityaGram', 'signup.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'AdityaGram', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));

module.exports = app;
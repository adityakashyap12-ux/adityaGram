const express = require('express');
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
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));
} else {
  console.log('MONGO_URI not found in .env');
}

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

// Example API - signup data save karna
// app.post('/api/signup', async (req, res) => { ... tera wala code yahan ayega ... })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));

// Vercel ke liye export
module.exports = app;
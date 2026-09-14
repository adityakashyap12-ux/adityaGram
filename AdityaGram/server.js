const express = require('express');
const path = require('path');
const app = express();

// Serve all files
app.use(express.static(__dirname));
app.use('/AdityaGram', express.static(path.join(__dirname, 'AdityaGram')));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "AdityaGram", "index.html"));
});

app.get('/signup.html', (req,res) => {
  res.sendFile(path.join(__dirname, "AdityaGram", "signup.html"));
});

app.get('/AdityaGram/index.html', (req,res) => {
  res.sendFile(path.join(__dirname, "AdityaGram", "index.html"));
});

app.get('/AdityaGram/login.html', (req,res) => {
  res.sendFile(path.join(__dirname, "AdityaGram", "login.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('running'));
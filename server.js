const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dono jagah se files serve karega - root se bhi aur AdityaGram se bhi
app.use(express.static(path.join(__dirname, 'AdityaGram')));
app.use(express.static(__dirname));

// login/signup ke liye direct route
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
app.listen(PORT, () => console.log('Server running'));
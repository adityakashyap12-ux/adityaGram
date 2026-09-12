const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // This will serve login.html and signup.html

let users = []; // temporary memory

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ success: false, message: 'User already exists!' });
  }
  users.push({ email, password });
  console.log('New user:', email);
  res.json({ success: true, message: 'Signup Successful! Go to Login.' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, message: 'Login Successful!' });
  } else {
    res.json({ success: false, message: 'Wrong email or password!' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
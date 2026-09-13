const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let users = [];

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get('/signup.html', (req,res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.get('/index.html', (req,res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/signup', (req,res) => {
  const { email, password } = req.body;
  if(users.find(u => u.email == email)){
    return res.json({ success: false, message: "User already exists!" });
  }
  users.push({ email, password });
  console.log("New user:", email);
  res.json({ success: true, message: "Signup Successful! Go to Login.." });
});

app.post('/login', (req,res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email == email && u.password == password);
  if(user) res.json({ success: true, message: "Login Successful!" });
  else res.json({ success: false, message: "Wrong email or password!" });
});

app.listen(process.env.PORT|| 10000, () => {
  console.log("AdityaGram running on http://localhost:3000");
});
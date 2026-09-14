const express = require('express');
const { put } = require('@vercel/blob');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB - Fixed for Vercel ---
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!MONGO_URI) {
      console.log('❌ MONGO_URI missing');
      return;
    }
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('❌ DB Error:', err);
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- Schemas ---
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String
}));
const Post = mongoose.model('Post', new mongoose.Schema({
  username: String,
  caption: String,
  imageUrl: String,
  likes: { type: Number, default: 0 }
}, { timestamps: true }));

// --- Static ---
app.use(express.static(path.join(__dirname, 'AdityaGram')));
app.use(express.static(__dirname));

// --- Routes ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'AdityaGram', 'login.html'));
});

// AUTH
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(await User.findOne({ email })) return res.json({ success: false, message: 'User already exists' });
    await User.create({ email, password });
    res.json({ success: true, message: 'Signup successful' });
  } catch(e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Server error: ' + e.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if(!user) return res.json({ success: false, message: 'Invalid login' });
    res.json({ success: true, message: 'Login success' });
  } catch(e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POSTS
app.get('/posts', async (req,res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});
app.get('/api/posts', async (req,res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

const upload = multer();
app.post('/posts', upload.single('image'), async (req,res) => {
  try {
    let imageUrl = "";
    if(req.file){
      const blob = await put(Date.now() + "-" + req.file.originalname, req.file.buffer, { access: 'public' });
      imageUrl = blob.url;
    }
    const post = await Post.create({
      username: req.body.username || "aditya",
      caption: req.body.caption,
      imageUrl
    });
    res.json(post);
  } catch(e){ res.status(500).json({ error: e.message }); }
});
app.post('/api/posts', upload.single('image'), async (req,res) => {
  try {
    let imageUrl = "";
    if(req.file){
      const blob = await put(Date.now() + "-" + req.file.originalname, req.file.buffer, { access: 'public' });
      imageUrl = blob.url;
    }
    const post = await Post.create({
      username: req.body.username || "aditya",
      caption: req.body.caption,
      imageUrl
    });
    res.json(post);
  } catch(e){ res.status(500).json({ error: e.message }); }
});

app.post('/posts/:id/like', async (req,res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});
app.post('/api/posts/:id/like', async (req,res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

module.exports = app;
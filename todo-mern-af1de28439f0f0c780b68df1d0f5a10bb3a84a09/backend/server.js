// backend/server.js
require('dotenv').config();           // ← load .env BEFORE you read process.env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Use MONGO_URI from .env (fallback to localhost if not set)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected at', MONGO_URI))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.get('/get', (req, res) => {
  TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndUpdate(id, { done: true }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  TodoModel.findByIdAndUpdate(id, { task }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

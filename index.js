const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 🛠️ Middleware
app.use(express.json());
app.use(cors());

// ✨ THE FIX: Professional Welcome Route
// This replaces the "Cannot GET /" error with a clear status message.
app.get("/", (req, res) => {
  res.send("💎 Crystal Pro API is Live and Running!");
});

// 🌍 Database Connection
// This uses your MONGO_URI from Render's Environment Variables for security.
const mongoURI = process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.yecfjq4.mongodb.net/todoDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ SUCCESS: PRO-FEATURE BACKEND CONNECTED"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 📝 Todo Schema & Model
// This matches your premium UI with Priority and Category support.
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, enum: ['General', 'College', 'Work'], default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// 📡 API Routes
// GET all todos (Sorted by newest first)
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  const { task, priority, category } = req.body;
  const newTodo = new Todo({ task, priority, category });
  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to toggle completion
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚀 Start Server
// Render assigns a dynamic port, so we use process.env.PORT.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server flying on port ${PORT}`));
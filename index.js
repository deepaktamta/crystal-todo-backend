const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const mongoURI = "mongodb+srv://admin:admin123@cluster0.yecfjq4.mongodb.net/todoDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ SUCCESS: PRO-FEATURE BACKEND CONNECTED"))
    .catch(err => console.log("❌ CONNECTION ERROR:", err.message));

// --- PROFESSIONAL SCHEMA ---
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    category: { type: String, default: 'General' },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// --- API ROUTES ---
app.get('/todos', async (req, res) => {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const { task, priority, category, description } = req.body;
    const newTodo = new Todo({ task, priority, category, description });
    await newTodo.save();
    res.json(newTodo);
});

// Update Route (For Toggling & Editing)
app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("🚀 Pro Server at http://localhost:5000"));
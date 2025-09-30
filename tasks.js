import express from "express";
import Task from "../models/Task.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dateTime: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create task
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, status, dateTime } = req.body;
    const file = req.file ? req.file.filename : null;

    const task = new Task({
      title,
      description,
      status,
      dateTime,
      file,
      filePreview: file ? `/uploads/${file}` : null,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, description, status, dateTime } = req.body;
    const updateData = { title, description, status, dateTime };
    if (req.file) {
      updateData.file = req.file.filename;
      updateData.filePreview = `/uploads/${req.file.filename}`;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;

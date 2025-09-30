import express from "express";
import Note from "../models/Note.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});

// Create note
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, body, dateTime } = req.body;
    const file = req.file ? req.file.filename : null;

    const note = new Note({
      title,
      body,
      dateTime,
      file,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating note" });
  }
});

// Update note
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, body, dateTime } = req.body;
    const updateData = { title, body, dateTime };
    if (req.file) updateData.file = req.file.filename;

    const updated = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating note" });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting note" });
  }
});

export default router;

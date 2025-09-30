import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, default: "" },
  file: { type: String },
  dateTime: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Note", NoteSchema);

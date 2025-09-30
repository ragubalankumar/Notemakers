import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Done"], default: "Pending" },
  file: { type: String },          // filename stored
  filePreview: { type: String },   // file URL for frontend
  dateTime: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);

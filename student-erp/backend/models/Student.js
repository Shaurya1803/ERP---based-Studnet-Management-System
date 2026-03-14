const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  rollNumber:   { type: String, required: true, unique: true },
  email:        { type: String, required: true },
  phone:        { type: String },
  course:       { type: String, required: true },
  year:         { type: Number, required: true },
  section:      { type: String },
  dateOfBirth:  { type: Date },
  address:      { type: String },
  guardianName: { type: String },
  guardianPhone:{ type: String },
  photo:        { type: String },
  status:       { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);

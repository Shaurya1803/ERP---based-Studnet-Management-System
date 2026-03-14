const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject:    { type: String, required: true },
  examType:   { type: String, enum: ["internal", "midterm", "final"], required: true },
  maxMarks:   { type: Number, required: true },
  obtained:   { type: Number, required: true },
  semester:   { type: Number, required: true },
  year:       { type: Number, required: true },
  remarks:    { type: String },
}, { timestamps: true });

// Virtual: percentage
marksSchema.virtual("percentage").get(function () {
  return ((this.obtained / this.maxMarks) * 100).toFixed(2);
});

// Virtual: grade
marksSchema.virtual("grade").get(function () {
  const p = (this.obtained / this.maxMarks) * 100;
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B+";
  if (p >= 60) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  return "F";
});

marksSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Marks", marksSchema);

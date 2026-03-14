const Marks   = require("../models/Marks");
const Student = require("../models/Student");

// POST add marks
exports.addMarks = async (req, res) => {
  try {
    const marks = await Marks.create(req.body);
    res.status(201).json(marks);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// GET marks by student
exports.getStudentMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET result card (grouped by subject)
exports.getResultCard = async (req, res) => {
  try {
    const marks   = await Marks.find({ student: req.params.studentId });
    const student = await Student.findById(req.params.studentId);
    const grouped = {};
    marks.forEach(m => {
      if (!grouped[m.subject]) grouped[m.subject] = [];
      grouped[m.subject].push({ examType: m.examType, obtained: m.obtained, maxMarks: m.maxMarks, grade: m.grade, percentage: m.percentage });
    });
    const totalObtained = marks.reduce((s, m) => s + m.obtained, 0);
    const totalMax      = marks.reduce((s, m) => s + m.maxMarks, 0);
    const overallPct    = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    res.json({ student, subjects: grouped, overall: { totalObtained, totalMax, percentage: overallPct } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT update marks
exports.updateMarks = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(marks);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// DELETE marks
exports.deleteMarks = async (req, res) => {
  try {
    await Marks.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET top performers
exports.getTopPerformers = async (req, res) => {
  try {
    const students = await Student.find({ status: "active" });
    const results  = [];
    for (const s of students) {
      const marks      = await Marks.find({ student: s._id });
      if (marks.length === 0) continue;
      const totalObt   = marks.reduce((sum, m) => sum + m.obtained, 0);
      const totalMax   = marks.reduce((sum, m) => sum + m.maxMarks, 0);
      const percentage = ((totalObt / totalMax) * 100).toFixed(1);
      results.push({ student: s, percentage: parseFloat(percentage) });
    }
    results.sort((a, b) => b.percentage - a.percentage);
    res.json(results.slice(0, 10));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

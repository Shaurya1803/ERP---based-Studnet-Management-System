const Student = require("../models/Student");

// GET all students
exports.getStudents = async (req, res) => {
  try {
    const { course, year, search } = req.query;
    let query = {};
    if (course)  query.course = course;
    if (year)    query.year   = year;
    if (search)  query.$or = [
      { name:       { $regex: search, $options: "i" } },
      { rollNumber: { $regex: search, $options: "i" } },
    ];
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST create student
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PUT update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET stats
exports.getStats = async (req, res) => {
  try {
    const total   = await Student.countDocuments();
    const active  = await Student.countDocuments({ status: "active" });
    const courses = await Student.distinct("course");
    res.json({ total, active, inactive: total - active, courses: courses.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

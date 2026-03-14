const Attendance = require("../models/Attendance");
const Student    = require("../models/Student");

// POST mark attendance (bulk)
exports.markAttendance = async (req, res) => {
  try {
    const { date, subject, records } = req.body;
    // records = [{ student, status }]
    const docs = records.map(r => ({
      student: r.student, date, subject,
      status: r.status, markedBy: req.user.id
    }));
    await Attendance.insertMany(docs);
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// GET attendance by student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, startDate, endDate } = req.query;
    let query = { student: studentId };
    if (subject) query.subject = subject;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }
    const records = await Attendance.find(query).sort({ date: -1 });
    const total   = records.length;
    const present = records.filter(r => r.status === "present").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    res.json({ records, stats: { total, present, absent: total - present, percentage } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET attendance summary for all students on a date
exports.getDailyAttendance = async (req, res) => {
  try {
    const { date, subject } = req.query;
    const records = await Attendance.find({ date: new Date(date), subject })
      .populate("student", "name rollNumber course year");
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET low attendance students (below 75%)
exports.getLowAttendance = async (req, res) => {
  try {
    const students = await Student.find({ status: "active" });
    const results  = [];
    for (const s of students) {
      const total   = await Attendance.countDocuments({ student: s._id });
      const present = await Attendance.countDocuments({ student: s._id, status: "present" });
      const pct     = total > 0 ? (present / total) * 100 : 0;
      if (pct < 75) results.push({ student: s, percentage: pct.toFixed(1), total, present });
    }
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

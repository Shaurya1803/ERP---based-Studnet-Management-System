const Marks      = require("../models/Marks");
const Attendance = require("../models/Attendance");
const Student    = require("../models/Student");

exports.analyzeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student  = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const marks      = await Marks.find({ student: studentId });
    const attendance = await Attendance.find({ student: studentId });

    const totalObt   = marks.reduce((s, m) => s + m.obtained, 0);
    const totalMax   = marks.reduce((s, m) => s + m.maxMarks, 0);
    const avgMark    = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(1) : 0;

    const present    = attendance.filter(a => a.status === "present").length;
    const attendPct  = attendance.length > 0 ? ((present / attendance.length) * 100).toFixed(1) : 0;

    const subjectSummary = {};
    marks.forEach(m => {
      if (!subjectSummary[m.subject]) subjectSummary[m.subject] = [];
      subjectSummary[m.subject].push((m.obtained / m.maxMarks) * 100);
    });
    const subjectAvgs = Object.entries(subjectSummary).map(([sub, scores]) => ({
      subject: sub,
      avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    }));

    const prompt = `
Student Name: ${student.name}
Course: ${student.course}, Year: ${student.year}
Overall Academic Performance: ${avgMark}%
Attendance: ${attendPct}%
Subject-wise performance: ${subjectAvgs.map(s => `${s.subject}: ${s.avg}%`).join(", ")}

Based on this data, provide:
1. A brief performance summary (2-3 sentences)
2. Top 3 strengths
3. Top 3 areas needing improvement
4. 3 specific actionable recommendations for the student
Keep the response concise and encouraging.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 500,
        messages: [
          { role: "system", content: "You are an academic advisor AI. Provide helpful, encouraging, and specific feedback for students. Be concise." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis.";

    res.json({
      student: student.name,
      stats: { avgMark, attendPct, totalSubjects: subjectAvgs.length },
      subjectAvgs,
      analysis
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student,    setStudent]    = useState(null);
  const [marks,      setMarks]      = useState([]);
  const [attendance, setAttendance] = useState({ stats: {}, records: [] });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [tab,        setTab]        = useState("overview");

  useEffect(() => {
    API.get(`/students/${id}`).then(r => setStudent(r.data)).catch(() => navigate("/students"));
    API.get(`/marks/student/${id}`).then(r => setMarks(r.data)).catch(() => {});
    API.get(`/attendance/student/${id}`).then(r => setAttendance(r.data)).catch(() => {});
  }, [id]);

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await API.get(`/ai/analyze/${id}`);
      setAiAnalysis(data);
    } catch { toast.error("AI analysis failed. Check your Groq API key."); }
    finally { setAiLoading(false); }
  };

  if (!student) return <div style={{ padding:40, textAlign:"center", color:"#64748b" }}>Loading...</div>;

  const tabs = ["overview", "marks", "attendance", "ai analysis"];

  return (
    <div>
      {/* Back + Header */}
      <button onClick={() => navigate("/students")} style={{
        background:"none", border:"none", color:"#6366f1", fontSize:14,
        cursor:"pointer", marginBottom:16, fontWeight:500
      }}>← Back to Students</button>

      {/* Student Card */}
      <div style={{ background:"#fff", borderRadius:12, padding:24, border:"1px solid #e2e8f0", marginBottom:20, display:"flex", gap:20, alignItems:"center" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:"#6366f1" }}>
          {student.name.charAt(0)}
        </div>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:22, fontWeight:700 }}>{student.name}</h1>
          <div style={{ display:"flex", gap:16, marginTop:6, flexWrap:"wrap" }}>
            {[
              ["🎓", student.course],
              ["📅", `Year ${student.year}`],
              ["🪪", student.rollNumber],
              ["📧", student.email],
              student.phone && ["📞", student.phone],
            ].filter(Boolean).map(([icon, val], i) => (
              <span key={i} style={{ fontSize:13, color:"#64748b" }}>{icon} {val}</span>
            ))}
          </div>
        </div>
        <span style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600,
          background: student.status==="active"?"#dcfce7":"#fee2e2",
          color: student.status==="active"?"#16a34a":"#ef4444" }}>
          {student.status}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#f1f5f9", padding:4, borderRadius:10, width:"fit-content" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"8px 18px", borderRadius:8, border:"none", fontSize:13, fontWeight:500,
            background: tab===t?"#fff":"transparent",
            color: tab===t?"#6366f1":"#64748b",
            boxShadow: tab===t?"0 1px 4px rgba(0,0,0,0.08)":undefined,
            textTransform:"capitalize", cursor:"pointer"
          }}>{t}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            ["Total Marks Entries", marks.length, "#6366f1"],
            ["Attendance Records",  attendance.stats?.total || 0, "#10b981"],
            ["Attendance %",       `${attendance.stats?.percentage || 0}%`, attendance.stats?.percentage >= 75 ? "#10b981" : "#ef4444"],
            ["Present Days",       attendance.stats?.present || 0, "#f59e0b"],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #e2e8f0" }}>
              <div style={{ fontSize:28, fontWeight:700, color }}>{value}</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>{label}</div>
            </div>
          ))}
          {student.guardianName && (
            <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #e2e8f0", gridColumn:"span 2" }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Guardian Details</h3>
              <p style={{ fontSize:13, color:"#64748b" }}>👤 {student.guardianName}</p>
              {student.guardianPhone && <p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>📞 {student.guardianPhone}</p>}
            </div>
          )}
        </div>
      )}

      {/* Marks Tab */}
      {tab==="marks" && (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead style={{ background:"#f8fafc" }}>
              <tr>{["Subject","Exam Type","Obtained","Max Marks","Percentage","Grade"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#374151", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>No marks added yet.</td></tr>
              ) : marks.map(m => (
                <tr key={m._id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                  <td style={{ padding:"12px 16px", fontWeight:500 }}>{m.subject}</td>
                  <td style={{ padding:"12px 16px", color:"#64748b", textTransform:"capitalize" }}>{m.examType}</td>
                  <td style={{ padding:"12px 16px" }}>{m.obtained}</td>
                  <td style={{ padding:"12px 16px", color:"#64748b" }}>{m.maxMarks}</td>
                  <td style={{ padding:"12px 16px" }}>{m.percentage}%</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ padding:"2px 10px", borderRadius:20, fontSize:12, fontWeight:700,
                      background: m.grade==="F"?"#fee2e2":m.grade.startsWith("A")?"#dcfce7":"#fef9c3",
                      color: m.grade==="F"?"#ef4444":m.grade.startsWith("A")?"#16a34a":"#854d0e" }}>
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Tab */}
      {tab==="attendance" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {[
              ["Total Classes", attendance.stats?.total || 0],
              ["Present", attendance.stats?.present || 0],
              ["Absent",  attendance.stats?.absent  || 0],
            ].map(([l,v]) => (
              <div key={l} style={{ background:"#fff", borderRadius:10, padding:16, border:"1px solid #e2e8f0", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:700 }}>{v}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead style={{ background:"#f8fafc" }}>
                <tr>{["Date","Subject","Status"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#374151", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {attendance.records?.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>No attendance records yet.</td></tr>
                ) : attendance.records?.slice(0,20).map(r => (
                  <tr key={r._id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                    <td style={{ padding:"10px 16px" }}>{new Date(r.date).toLocaleDateString()}</td>
                    <td style={{ padding:"10px 16px", color:"#64748b" }}>{r.subject}</td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                        background: r.status==="present"?"#dcfce7":r.status==="late"?"#fef9c3":"#fee2e2",
                        color: r.status==="present"?"#16a34a":r.status==="late"?"#854d0e":"#ef4444" }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Analysis Tab */}
      {tab==="ai analysis" && (
        <div style={{ background:"#fff", borderRadius:12, padding:24, border:"1px solid #e2e8f0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h3 style={{ fontSize:16, fontWeight:600 }}>🤖 AI Performance Analysis</h3>
              <p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>Get AI-powered insights about this student</p>
            </div>
            <button onClick={handleAI} disabled={aiLoading} style={{
              background: aiLoading?"#a5b4fc":"#6366f1", color:"#fff", border:"none",
              padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor: aiLoading?"not-allowed":"pointer"
            }}>
              {aiLoading ? "⏳ Analyzing..." : "⚡ Analyze Student"}
            </button>
          </div>
          {aiAnalysis && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                {[
                  ["📊 Avg Score", `${aiAnalysis.stats.avgMark}%`],
                  ["📅 Attendance", `${aiAnalysis.stats.attendPct}%`],
                  ["📚 Subjects", aiAnalysis.stats.totalSubjects],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:"#f8fafc", borderRadius:8, padding:14, textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:"#6366f1" }}>{v}</div>
                    <div style={{ fontSize:12, color:"#64748b" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"#f0fdf4", borderRadius:10, padding:16, border:"1px solid #bbf7d0" }}>
                <h4 style={{ fontSize:14, fontWeight:600, color:"#166534", marginBottom:10 }}>AI Recommendations</h4>
                <p style={{ fontSize:13, lineHeight:1.8, color:"#15803d", whiteSpace:"pre-wrap" }}>{aiAnalysis.analysis}</p>
              </div>
            </div>
          )}
          {!aiAnalysis && !aiLoading && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8" }}>
              Click "Analyze Student" to get AI-powered insights
            </div>
          )}
        </div>
      )}
    </div>
  );
}

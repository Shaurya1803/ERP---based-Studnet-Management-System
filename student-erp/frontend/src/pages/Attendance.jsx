import { useState, useEffect } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function Attendance() {
  const [students,  setStudents]  = useState([]);
  const [records,   setRecords]   = useState([]);
  const [subject,   setSubject]   = useState("");
  const [date,      setDate]      = useState(new Date().toISOString().split("T")[0]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => { API.get("/students").then(r => {
    setStudents(r.data);
    setRecords(r.data.map(s => ({ student: s._id, status: "present" })));
  }); }, []);

  const setStatus = (studentId, status) => {
    setRecords(prev => prev.map(r => r.student === studentId ? { ...r, status } : r));
  };

  const handleSubmit = async () => {
    if (!subject) return toast.error("Please enter a subject");
    setLoading(true);
    try {
      await API.post("/attendance", { date, subject, records });
      toast.success("Attendance marked successfully!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to mark attendance"); }
    finally { setLoading(false); }
  };

  const statusColor = { present: "#16a34a", absent: "#ef4444", late: "#d97706" };
  const statusBg    = { present: "#dcfce7", absent: "#fee2e2", late: "#fef9c3" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Attendance</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Mark attendance for today's class</p>
      </div>

      {/* Controls */}
      <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #e2e8f0", marginBottom:20 }}>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:180 }}>
            <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:6 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ flex:2, minWidth:200 }}>
            <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:6 }}>Subject *</label>
            <input placeholder="e.g. Mathematics, Physics..." value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <button onClick={() => setRecords(prev => prev.map(r => ({ ...r, status:"present" })))}
              style={{ padding:"9px 16px", borderRadius:8, border:"1px solid #e2e8f0", background:"#dcfce7", color:"#16a34a", fontSize:13, fontWeight:500 }}>
              All Present
            </button>
            <button onClick={() => setRecords(prev => prev.map(r => ({ ...r, status:"absent" })))}
              style={{ padding:"9px 16px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fee2e2", color:"#ef4444", fontSize:13, fontWeight:500 }}>
              All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"14px 20px", background:"#f8fafc", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, fontWeight:600 }}>Students ({students.length})</span>
          <span style={{ fontSize:13, color:"#64748b" }}>
            ✅ Present: {records.filter(r=>r.status==="present").length} &nbsp;
            ❌ Absent: {records.filter(r=>r.status==="absent").length} &nbsp;
            🕐 Late: {records.filter(r=>r.status==="late").length}
          </span>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #e2e8f0" }}>
              {["Roll No","Name","Course","Year","Status"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontWeight:600, color:"#374151" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={5} style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>No students found.</td></tr>
            ) : students.map(s => {
              const rec = records.find(r => r.student === s._id);
              return (
                <tr key={s._id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                  <td style={{ padding:"10px 16px", fontWeight:500 }}>{s.rollNumber}</td>
                  <td style={{ padding:"10px 16px" }}>{s.name}</td>
                  <td style={{ padding:"10px 16px", color:"#64748b" }}>{s.course}</td>
                  <td style={{ padding:"10px 16px", color:"#64748b" }}>Year {s.year}</td>
                  <td style={{ padding:"10px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      {["present","absent","late"].map(st => (
                        <button key={st} onClick={() => setStatus(s._id, st)} style={{
                          padding:"4px 12px", borderRadius:20, border:"2px solid",
                          borderColor: rec?.status===st ? statusColor[st] : "#e2e8f0",
                          background: rec?.status===st ? statusBg[st] : "#fff",
                          color: rec?.status===st ? statusColor[st] : "#94a3b8",
                          fontSize:11, fontWeight:600, cursor:"pointer", textTransform:"capitalize"
                        }}>{st}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={handleSubmit} disabled={loading || students.length===0} style={{
        padding:"12px 32px", background:"#6366f1", color:"#fff", border:"none",
        borderRadius:8, fontSize:14, fontWeight:600, cursor: loading?"not-allowed":"pointer"
      }}>
        {loading ? "Saving..." : "✅ Submit Attendance"}
      </button>
    </div>
  );
}

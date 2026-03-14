import { useState, useEffect } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function Marks() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({
    student:"", subject:"", examType:"internal", maxMarks:100, obtained:"", semester:1, year:1, remarks:""
  });

  useEffect(() => { API.get("/students").then(r => setStudents(r.data)); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (+form.obtained > +form.maxMarks) return toast.error("Obtained marks cannot exceed max marks");
    setLoading(true);
    try {
      await API.post("/marks", form);
      toast.success("Marks added successfully!");
      setShowForm(false);
      setForm({ student:"", subject:"", examType:"internal", maxMarks:100, obtained:"", semester:1, year:1, remarks:"" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add marks"); }
    finally { setLoading(false); }
  };

  const pct = form.obtained && form.maxMarks ? ((form.obtained / form.maxMarks) * 100).toFixed(1) : null;
  const grade = pct >= 90?"A+":pct >= 80?"A":pct >= 70?"B+":pct >= 60?"B":pct >= 50?"C":pct >= 40?"D":pct !== null?"F":null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:700 }}>Marks</h1>
          <p style={{ color:"#64748b", fontSize:14 }}>Add and manage student marks & results</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background:"#6366f1", color:"#fff", border:"none",
          padding:"10px 20px", borderRadius:8, fontSize:14, fontWeight:600
        }}>+ Add Marks</button>
      </div>

      {/* Info cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[
          ["Click a student on the Students page", "📋", "to view their marks & result card"],
          ["Use AI Analysis tab",                  "🤖", "on student profile for smart insights"],
          ["Dashboard shows Top 10 Performers",    "🏆", "automatically based on marks data"],
        ].map(([t,i,s]) => (
          <div key={t} style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #e2e8f0", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{i}</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{t}</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:12, padding:24, border:"1px solid #e2e8f0" }}>
        <h3 style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>How to use Marks module</h3>
        <p style={{ fontSize:13, color:"#64748b", lineHeight:1.8 }}>
          1. Click <strong>+ Add Marks</strong> button above to enter marks for any student.<br/>
          2. Go to <strong>Students</strong> page and click on any student to view their result card.<br/>
          3. In the student detail page, click the <strong>Marks tab</strong> to see all marks.<br/>
          4. Use the <strong>AI Analysis tab</strong> to get smart performance insights using Groq AI.
        </p>
      </div>

      {/* Add Marks Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700 }}>Add Marks</h2>
              <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer" }}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ gridColumn:"span 2" }}>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Student *</label>
                  <select value={form.student} onChange={e => setForm({...form, student:e.target.value})} required>
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Subject *</label>
                  <input placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Exam Type *</label>
                  <select value={form.examType} onChange={e => setForm({...form, examType:e.target.value})}>
                    <option value="internal">Internal</option>
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Max Marks *</label>
                  <input type="number" value={form.maxMarks} onChange={e => setForm({...form, maxMarks:+e.target.value})} required min={1} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Marks Obtained *</label>
                  <input type="number" placeholder="0" value={form.obtained} onChange={e => setForm({...form, obtained:+e.target.value})} required min={0} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Semester</label>
                  <select value={form.semester} onChange={e => setForm({...form, semester:+e.target.value})}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Year</label>
                  <select value={form.year} onChange={e => setForm({...form, year:+e.target.value})}>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>

              {/* Live grade preview */}
              {pct !== null && (
                <div style={{ marginTop:14, padding:"12px 16px", background:"#f8fafc", borderRadius:8, display:"flex", gap:20 }}>
                  <span style={{ fontSize:13, color:"#64748b" }}>Percentage: <strong>{pct}%</strong></span>
                  <span style={{ fontSize:13, color:"#64748b" }}>Grade: <strong style={{ color: grade==="F"?"#ef4444":grade.startsWith("A")?"#16a34a":"#1e293b" }}>{grade}</strong></span>
                </div>
              )}

              <div style={{ marginTop:14 }}>
                <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Remarks</label>
                <input placeholder="Optional remarks..." value={form.remarks} onChange={e => setForm({...form, remarks:e.target.value})} />
              </div>

              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button type="submit" disabled={loading} style={{
                  flex:1, padding:"11px", background:"#6366f1", color:"#fff",
                  border:"none", borderRadius:8, fontSize:14, fontWeight:600 }}>
                  {loading ? "Adding..." : "Add Marks"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  flex:1, padding:"11px", background:"#f1f5f9", color:"#374151",
                  border:"none", borderRadius:8, fontSize:14 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

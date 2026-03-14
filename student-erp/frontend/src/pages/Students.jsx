import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

const COURSES = ["B.Com", "B.Sc", "B.A", "BCA", "B.Tech", "MBA", "M.Com"];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState("");
  const [course,   setCourse]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form,     setForm]     = useState({
    name: "", rollNumber: "", email: "", phone: "",
    course: "", year: "", section: "", guardianName: "", address: ""
  });
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (course) params.course = course;
      const { data } = await API.get("/students", { params });
      setStudents(data);
    } catch { toast.error("Failed to load students"); }
  };

  useEffect(() => { fetchStudents(); }, [search, course]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/students", form);
      toast.success("Student added successfully!");
      setShowForm(false);
      setForm({ name:"",rollNumber:"",email:"",phone:"",course:"",year:"",section:"",guardianName:"",address:"" });
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || "Error adding student"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await API.delete(`/students/${id}`);
      toast.success("Student deleted");
      fetchStudents();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Students</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>{students.length} students found</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: "#6366f1", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600
        }}>+ Add Student</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍 Search by name or roll number..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <select value={course} onChange={e => setCourse(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">All Courses</option>
          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead style={{ background:"#f8fafc" }}>
            <tr>
              {["Roll No","Name","Course","Year","Email","Phone","Status","Actions"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#374151", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>No students found. Add your first student!</td></tr>
            ) : students.map(s => (
              <tr key={s._id} style={{ borderBottom:"1px solid #f1f5f9", cursor:"pointer" }}
                onMouseEnter={e => e.currentTarget.style.background="#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"12px 16px", fontWeight:500 }} onClick={() => navigate(`/students/${s._id}`)}>{s.rollNumber}</td>
                <td style={{ padding:"12px 16px" }} onClick={() => navigate(`/students/${s._id}`)}>{s.name}</td>
                <td style={{ padding:"12px 16px", color:"#64748b" }}>{s.course}</td>
                <td style={{ padding:"12px 16px", color:"#64748b" }}>Year {s.year}</td>
                <td style={{ padding:"12px 16px", color:"#64748b" }}>{s.email}</td>
                <td style={{ padding:"12px 16px", color:"#64748b" }}>{s.phone || "-"}</td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                    background: s.status==="active"?"#dcfce7":"#fee2e2",
                    color: s.status==="active"?"#16a34a":"#ef4444" }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <button onClick={() => navigate(`/students/${s._id}`)} style={{ background:"#eff6ff", color:"#3b82f6", border:"none", padding:"5px 12px", borderRadius:6, fontSize:12, marginRight:6 }}>View</button>
                  <button onClick={() => handleDelete(s._id, s.name)} style={{ background:"#fef2f2", color:"#ef4444", border:"none", padding:"5px 12px", borderRadius:6, fontSize:12 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700 }}>Add New Student</h2>
              <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer" }}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  ["name","Full Name","text",true],
                  ["rollNumber","Roll Number","text",true],
                  ["email","Email","email",true],
                  ["phone","Phone","text",false],
                  ["section","Section","text",false],
                  ["guardianName","Guardian Name","text",false],
                ].map(([key,label,type,req]) => (
                  <div key={key}>
                    <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>{label}{req?" *":""}</label>
                    <input type={type} value={form[key]} required={req}
                      onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Course *</label>
                  <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required>
                    <option value="">Select Course</option>
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Year *</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required>
                    <option value="">Select Year</option>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ fontSize:12, fontWeight:500, color:"#374151", display:"block", marginBottom:4 }}>Address</label>
                <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ width:"100%", resize:"vertical" }} />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button type="submit" disabled={loading} style={{
                  flex:1, padding:"11px", background:"#6366f1", color:"#fff",
                  border:"none", borderRadius:8, fontSize:14, fontWeight:600 }}>
                  {loading ? "Adding..." : "Add Student"}
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

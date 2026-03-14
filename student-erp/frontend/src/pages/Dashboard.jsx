import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import API from "../utils/api";

const Card = ({ label, value, icon, color }) => (
  <div style={{
    background: "#fff", borderRadius: 12, padding: "20px 24px",
    border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "20",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
    </div>
  </div>
);

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [stats,    setStats]    = useState({});
  const [toppers,  setToppers]  = useState([]);
  const [lowAtt,   setLowAtt]   = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/students/stats").then(r => setStats(r.data)).catch(() => {});
    API.get("/marks/top").then(r => setToppers(r.data.slice(0, 5))).catch(() => {});
    API.get("/attendance/low").then(r => setLowAtt(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const pieData = [
    { name: "Active",   value: stats.active   || 0 },
    { name: "Inactive", value: stats.inactive || 0 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Welcome to EduERP — Student Management System</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <Card label="Total Students"  value={stats.total    || 0} icon="🎓" color="#6366f1" />
        <Card label="Active Students" value={stats.active   || 0} icon="✅" color="#10b981" />
        <Card label="Courses"         value={stats.courses  || 0} icon="📚" color="#f59e0b" />
        <Card label="Low Attendance"  value={lowAtt.length}       icon="⚠️" color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Top Performers */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🏆 Top Performers</h3>
          {toppers.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 13 }}>No data yet. Add marks to see top performers.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={toppers.map(t => ({ name: t.student.name.split(" ")[0], pct: parseFloat(t.percentage) }))}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                <Bar dataKey="pct" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Student Status Pie */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>👥 Student Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={12}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {lowAtt.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #fee2e2" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#ef4444" }}>⚠️ Low Attendance Alert (Below 75%)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Student","Roll No","Course","Attendance %"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowAtt.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                  onClick={() => navigate(`/students/${r.student._id}`)}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{r.student.name}</td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{r.student.rollNumber}</td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{r.student.course}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: "#fee2e2", color: "#ef4444", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                      {r.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const { login, loading }  = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) { toast.success("Welcome back!"); navigate("/"); }
    else toast.error(res.message);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "linear-gradient(135deg,#667eea,#764ba2)"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "40px 36px",
        width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>EduERP System</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Student Management Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="admin@school.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: loading ? "#a5b4fc" : "#6366f1", color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20 }}>
          Default: admin@school.com / admin123
        </p>
      </div>
    </div>
  );
}

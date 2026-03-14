import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { path: "/",           icon: "📊", label: "Dashboard"  },
  { path: "/students",   icon: "🎓", label: "Students"   },
  { path: "/attendance", icon: "📅", label: "Attendance" },
  { path: "/marks",      icon: "📝", label: "Marks"      },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#1e293b", color: "#fff",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}>🎓 EduERP</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Student Management</div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV.map(n => (
            <NavLink key={n.path} to={n.path} end={n.path === "/"}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8, marginBottom: 4,
                fontSize: 14, fontWeight: 500, color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#6366f1" : "transparent",
                textDecoration: "none", transition: "all 0.15s"
              })}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #334155" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, textTransform: "capitalize" }}>{user?.role}</div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #334155",
            background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer"
          }}>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: 28, minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}

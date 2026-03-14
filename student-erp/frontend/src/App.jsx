import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout       from "./components/layout/Layout";
import Dashboard    from "./pages/Dashboard";
import Students     from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Attendance   from "./pages/Attendance";
import Marks        from "./pages/Marks";
import Login        from "./pages/Login";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index              element={<Dashboard />} />
            <Route path="students"    element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="attendance"  element={<Attendance />} />
            <Route path="marks"       element={<Marks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

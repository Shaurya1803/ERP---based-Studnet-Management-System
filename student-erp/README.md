# 🎓 EduERP — Student Management System

A full-stack ERP system built with React, Node.js, Express, MongoDB & Groq AI.

## 📁 Folder Structure

```
student-erp/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic (auth, students, attendance, marks, AI)
│   ├── middleware/     → JWT auth middleware
│   ├── models/         → Mongoose schemas (User, Student, Attendance, Marks)
│   ├── routes/         → API routes
│   ├── .env            → Environment variables
│   ├── server.js       → Main entry point
│   └── package.json
│
└── frontend/
    ├── public/         → index.html
    ├── src/
    │   ├── components/
    │   │   └── layout/ → Sidebar + Layout
    │   ├── context/    → AuthContext (JWT login state)
    │   ├── pages/      → Dashboard, Students, Attendance, Marks, Login
    │   ├── utils/      → Axios API instance
    │   ├── App.jsx     → Routes
    │   └── index.js
    ├── .env
    └── package.json
```

## 🚀 Features
- ✅ JWT Authentication (Login/Logout)
- ✅ Student Registration & Profiles
- ✅ Attendance Marking (Bulk, per subject)
- ✅ Marks Entry with Auto Grade Calculation
- ✅ AI Performance Analysis (Groq AI)
- ✅ Dashboard with Charts
- ✅ Low Attendance Alerts
- ✅ Top Performers Leaderboard

## 🛠 Tech Stack
- **Frontend**: React.js 18, React Router, Recharts, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT + bcryptjs
- **AI**: Groq API (llama3-8b-8192)

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

## ⚙️ Setup Instructions

### Step 1 — Install MongoDB
Download and install MongoDB Community from: https://www.mongodb.com/try/download/community

### Step 2 — Setup Backend
```bash
cd backend
npm install
```
Edit `.env` and add your keys:
```
MONGO_URI=mongodb://localhost:27017/student_erp
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_key_from_console.groq.com
```
Start backend:
```bash
npm run dev
```

### Step 3 — Setup Frontend
```bash
cd frontend
npm install
npm start
```

### Step 4 — Create Admin Account
Use Postman or any REST client to POST to:
```
POST http://localhost:5000/api/auth/register
{
  "name": "Admin",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```
Then login at http://localhost:3000

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

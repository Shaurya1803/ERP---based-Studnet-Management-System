#  EduERP — Student Management System

A full-stack ERP-based Student Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **Groq AI** for intelligent student performance analysis.



##  Live Demo

> Run locally — see setup instructions below



 Features

-  **JWT Authentication** — Secure login/logout for admin and teachers
-  **Student Management** — Add, view, search, update and delete student profiles
-  **Attendance Management** — Mark bulk attendance per subject with present/absent/late status
-  **Marks & Results** — Add marks with automatic grade and percentage calculation
-  **AI Performance Analysis** — Groq AI analyzes student data and gives personalized recommendations
-  **Dashboard** — Live charts showing top performers, student status, and low attendance alerts
-  **Low Attendance Alerts** — Auto-detect students below 75% attendance


##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| AI Integration | Groq API (llama3-8b-8192 model) |
| Charts | Recharts |
| HTTP Client | Axios |
| Notifications | React Hot Toast |



 ## Folder Structure


student-erp/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, register, get user
│   │   ├── studentController.js   # CRUD for students
│   │   ├── attendanceController.js# Mark & fetch attendance
│   │   ├── marksController.js     # Add & fetch marks
│   │   └── aiController.js        # Groq AI analysis
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token verification
│   ├── models/
│   │   ├── User.js                # Admin/Teacher schema
│   │   ├── Student.js             # Student schema
│   │   ├── Attendance.js          # Attendance schema
│   │   └── Marks.js               # Marks + grade virtuals
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── marksRoutes.js
│   │   └── aiRoutes.js
│   ├── .env                       # Environment variables
│   ├── server.js                  # Main entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       └── Layout.jsx     # Sidebar + main layout
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Dashboard.jsx      # Charts & stats
    │   │   ├── Students.jsx       # Student list & add
    │   │   ├── StudentDetail.jsx  # Profile, marks, AI tab
    │   │   ├── Attendance.jsx     # Mark attendance
    │   │   └── Marks.jsx          # Add marks
    │   ├── utils/
    │   │   └── api.js             # Axios instance + interceptors
    │   ├── App.jsx                # Routes
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json




## Installation & Setup

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) (v16 or above)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) or MongoDB Atlas
- [Git](https://git-scm.com)


### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/student-erp.git
cd student-erp
```

---

### Step 2 — Setup Backend

`bash
cd backend
npm install


Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_erp
JWT_SECRET=your_super_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

> Get your free Groq API key at [console.groq.com](https://console.groq.com)

Start the backend server:

```bash
npm run dev
```



### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

### Step 4 — Create Admin Account

Use Thunder Client (VS Code extension) or Postman to register:

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

Then login at `http://localhost:3000` with:
```
Email:    admin@school.com
Password: admin123
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add new student |
| GET | `/api/students/:id` | Get single student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/stats` | Get student stats |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark bulk attendance |
| GET | `/api/attendance/student/:id` | Get student attendance |
| GET | `/api/attendance/low` | Get low attendance students |

### Marks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/marks` | Add marks |
| GET | `/api/marks/student/:id` | Get student marks |
| GET | `/api/marks/result/:id` | Get result card |
| GET | `/api/marks/top` | Get top performers |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/analyze/:studentId` | AI performance analysis |

---

## 📊 Grade System

| Percentage | Grade |
|-----------|-------|
| 90% and above | A+ |
| 80% – 89% | A |
| 70% – 79% | B+ |
| 60% – 69% | B |
| 50% – 59% | C |
| 40% – 49% | D |
| Below 40% | F |

---

## 🚀 Future Enhancements

- [ ] Fee management module
- [ ] PDF result card download
- [ ] Email notifications for low attendance
- [ ] Mobile responsive design
- [ ] Role-based access (Admin vs Teacher)
- [ ] Timetable management
- [ ] Online exam module








## 📄 License

This project is built for academic/educational purposes.

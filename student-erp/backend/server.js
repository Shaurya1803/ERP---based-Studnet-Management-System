const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ── Middleware
app.use(cors());
app.use(express.json());

// ── Routes
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/students",   require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/marks",      require("./routes/marksRoutes"));
app.use("/api/ai",         require("./routes/aiRoutes"));

// ── Health check
app.get("/", (req, res) => res.json({ message: "Student ERP API Running ✅" }));

// ── Connect DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Error:", err));

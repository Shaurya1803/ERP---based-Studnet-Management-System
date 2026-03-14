const express = require("express");
const router  = express.Router();
const { markAttendance, getStudentAttendance, getDailyAttendance, getLowAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/",                        markAttendance);
router.get("/daily",                    getDailyAttendance);
router.get("/low",                      getLowAttendance);
router.get("/student/:studentId",       getStudentAttendance);

module.exports = router;

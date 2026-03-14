const express = require("express");
const router  = express.Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStats } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/stats", getStats);
router.route("/").get(getStudents).post(createStudent);
router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

module.exports = router;

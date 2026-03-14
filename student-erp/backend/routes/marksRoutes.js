const express = require("express");
const router  = express.Router();
const { addMarks, getStudentMarks, getResultCard, updateMarks, deleteMarks, getTopPerformers } = require("../controllers/marksController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/top",                        getTopPerformers);
router.route("/").post(addMarks);
router.get("/student/:studentId",         getStudentMarks);
router.get("/result/:studentId",          getResultCard);
router.route("/:id").put(updateMarks).delete(deleteMarks);

module.exports = router;

const express = require("express");
const router  = express.Router();
const { analyzeStudent } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/analyze/:studentId", analyzeStudent);

module.exports = router;

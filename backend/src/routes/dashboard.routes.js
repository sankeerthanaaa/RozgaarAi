const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getResumeStats,
} = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/stats", protect, getDashboardStats);
router.get("/resume/:resumeId", protect, getResumeStats);

module.exports = router;
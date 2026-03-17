const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resume.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../services/fileUpload.service");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/", protect, getResumes);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

module.exports = router;
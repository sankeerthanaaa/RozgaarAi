const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/upload.middleware");
const {protect} = require("../middleware/auth.middleware");

const { uploadResume } = require("../controllers/resume.controller");

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Resume route working ✅");
});

// ✅ Upload route
router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
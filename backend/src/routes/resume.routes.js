const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const verifyToken = require("../middleware/auth.middleware");

const { uploadResume } = require("../controllers/resume.controller");

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Resume route working ✅");
});

// ✅ Upload route
router.post("/upload", verifyToken, upload.single("resume"), uploadResume);

module.exports = router;
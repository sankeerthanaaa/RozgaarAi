const Resume = require("../models/Resume.model");
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");
const pdfParse = require("pdf-parse");

// ✅ Upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "raw",
        format: "pdf",
        access_mode: "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ✅ Upload Resume Controller
const uploadResume = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ✅ Step 1 — Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    console.log("CLOUDINARY URL:", cloudinaryResult.secure_url);

    // ✅ Step 2 — Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();
    console.log("PARSED TEXT:", extractedText.substring(0, 200)); // preview first 200 chars

    // ✅ Step 3 — Save to MongoDB with parsedText
    const newResume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      parsedText: extractedText, // ✅ saved here
      status: "parsed",          // ✅ update status from "uploaded" to "parsed"
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded and text extracted successfully ✅",
      resume: newResume,
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadResume };
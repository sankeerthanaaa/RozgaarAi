const Resume = require("../models/Resume.model");
// ✅ Correct
const cloudinary = require("../config/cloudinary.js");

const streamifier = require("streamifier");

// ✅ Upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "raw", // ✅ required for PDFs
        format: "pdf",
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

    // ✅ Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    console.log("CLOUDINARY URL:", cloudinaryResult.secure_url);

    // ✅ Save to MongoDB
    const newResume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully ✅",
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
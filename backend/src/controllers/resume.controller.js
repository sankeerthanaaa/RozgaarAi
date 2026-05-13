const Resume = require("../models/Resume.model");
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");
const pdfParse = require("pdf-parse");
const { analyzeATS } = require("../services/ats.service");
const { getAIResponse } = require("../services/ai.service");

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

// ✅ Parse structured data from resume text using Gemini
const parseStructuredData = async (resumeText) => {
  const prompt = `
    Extract structured information from this resume text.
    Return ONLY a valid JSON object with this exact structure, no extra text:
    {
      "name": "<full name>",
      "email": "<email>",
      "phone": "<phone number>",
      "location": "<city, state>",
      "summary": "<professional summary or objective if present>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "experience": [
        {
          "title": "<job title>",
          "company": "<company name>",
          "startDate": "<start date>",
          "endDate": "<end date or Present>",
          "description": "<job description>"
        }
      ],
      "education": [
        {
          "school": "<school name>",
          "degree": "<degree type>",
          "field": "<field of study>",
          "startDate": "<start date>",
          "endDate": "<end date>"
        }
      ]
    }

    Resume Text:
    ${resumeText}
  `;

  return await getAIResponse(prompt);
};

// ✅ Upload Resume Controller
const uploadResume = async (req, res) => {
  try {
    console.log("FILE:", req.file?.originalname);
    console.log("USER:", req.user?.id);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ✅ Step 1 — Upload to Cloudinary
    console.log("⏳ Uploading to Cloudinary...");
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    console.log("✅ Cloudinary upload done:", cloudinaryResult.secure_url);

    // ✅ Step 2 — Extract text from PDF buffer
    console.log("⏳ Extracting text from PDF...");
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();
    console.log("✅ Text extracted, length:", extractedText.length);

    // ✅ Step 3 — Parse structured data using Gemini
    console.log("⏳ Parsing structured data with AI...");
    let parsedData = { skills: [], experience: [], education: [] };
    try {
      parsedData = await parseStructuredData(extractedText);
      console.log("✅ Structured data parsed");
    } catch (aiError) {
      console.error("⚠️ Structured parsing failed:", aiError.message);
      // Continue without structured data
    }

    // ✅ Step 4 — ATS Analysis using Gemini
    console.log("⏳ Running ATS analysis...");
    let atsResult = { atsScore: 0, suggestions: [], keywords: { found: [], missing: [] } };
    try {
      atsResult = await analyzeATS(extractedText);
      console.log("✅ ATS analysis done, score:", atsResult.atsScore);
    } catch (atsError) {
      console.error("⚠️ ATS analysis failed:", atsError.message);
      // Continue without ATS score
    }

    // ✅ Step 5 — Save everything to MongoDB
    const newResume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      parsedText: extractedText,
      parsedData: {
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: parsedData.location || "",
        summary: parsedData.summary || "",
        skills: parsedData.skills || [],
        experience: parsedData.experience || [],
        education: parsedData.education || [],
      },
      atsScore: atsResult.atsScore || 0,
      atsResult: {
        scoreBreakdown: atsResult.formatting || {},
        keywordsMatched: atsResult.keywords?.found || [],
        missingKeywords: atsResult.keywords?.missing || [],
      },
      suggestions: atsResult.suggestions || [],
      status: "analyzed",
    });

    console.log("✅ Resume saved to MongoDB:", newResume._id);

    res.status(201).json({
      success: true,
      message: "Resume uploaded, parsed and analyzed successfully ✅",
      resume: newResume,
    });

  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadResume };
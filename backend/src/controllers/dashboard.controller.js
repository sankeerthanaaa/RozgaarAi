const Resume = require("../models/Resume.model");
const ResumeHistory = require("../models/ResumeHistory.model");
const JDMatch = require("../models/JDMatch.model");
const InterviewSession = require("../models/InterviewSession.model");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all resumes
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    // Total resumes
    const totalResumes = resumes.length;

    // Average ATS score
    const averageAtsScore =
      totalResumes > 0
        ? Math.round(
            resumes.reduce((acc, resume) => acc + (resume.atsScore || 0), 0) /
              totalResumes
          )
        : 0;

    // Last uploaded resume
    const lastUpload =
      totalResumes > 0 ? resumes[0].createdAt : null;

    // Recent history (last 5 activities)
    const recentActivity = await ResumeHistory.find({ userId })
      .populate("resumeId", "fileName atsScore")
      .sort({ createdAt: -1 })
      .limit(5);

    // Total JD matches
    const totalJDMatches = await JDMatch.countDocuments({ userId });

    // Total interview sessions
    const totalInterviews = await InterviewSession.countDocuments({ userId });

    // Best ATS score
    const bestAtsScore =
      totalResumes > 0
        ? Math.max(...resumes.map((r) => r.atsScore || 0))
        : 0;

    // Score history for chart (last 7 resumes)
    const scoreHistory = resumes.slice(0, 7).map((resume) => ({
      fileName: resume.fileName,
      score: resume.atsScore || 0,
      date: resume.createdAt,
    }));

    // Top skills from all resumes
    const allSkills = resumes.flatMap(
      (resume) => resume.parsedData?.skills || []
    );
    const skillCount = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});
    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    res.status(200).json({
      success: true,
      data: {
        totalResumes,
        averageAtsScore,
        bestAtsScore,
        lastUpload,
        totalJDMatches,
        totalInterviews,
        recentActivity,
        scoreHistory,
        topSkills,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getResumeStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const jdMatches = await JDMatch.find({ userId, resumeId }).sort({
      createdAt: -1,
    });

    const interviews = await InterviewSession.find({
      userId,
      resumeId,
    }).sort({ createdAt: -1 });

    const history = await ResumeHistory.find({ userId, resumeId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        resume,
        jdMatches,
        interviews,
        history,
      },
    });
  } catch (error) {
    console.error("Resume Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { getDashboardStats, getResumeStats };
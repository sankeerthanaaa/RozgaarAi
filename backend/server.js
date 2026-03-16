const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const jdRoutes = require("./src/routes/jd.routes");
const interviewRoutes = require("./src/routes/interview.routes");
const linkedinRoutes = require("./src/routes/linkedin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/jd", jdRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/linkedin", linkedinRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "RozgaarAI Backend is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
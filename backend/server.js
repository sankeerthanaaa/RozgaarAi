// ✅ FIRST LINE - before everything else
const dotenv = require("dotenv");
dotenv.config();

// Now all process.env vars are available for everything below
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const resumeRoutes = require("./src/routes/resume.routes");

const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
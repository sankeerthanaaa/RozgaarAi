const express = require("express");
const router  = express.Router();
const {
  register,
  login,
  refresh,
  getMe,
  logout,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");

// Public
router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refresh);

// Protected
router.get("/me",      verifyToken, getMe);
router.post("/logout", verifyToken, logout);

module.exports = router;
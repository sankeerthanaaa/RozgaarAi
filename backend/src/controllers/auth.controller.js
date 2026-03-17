const jwt = require("jsonwebtoken");

const register = (req, res) => {
  res.json({ success: true });
};

const login = (req, res) => {
  const token = jwt.sign({ id: "123" }, "secret", { expiresIn: "7d" });

  res.json({
    success: true,
    accessToken: token,
  });
};

const getProfile = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

const updateProfile = (req, res) => {
  res.json({
    success: true,
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
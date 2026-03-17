const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    profilePhoto: { type: String, default: null },
    linkedinUrl:  { type: String, default: null },
    refreshToken: { type: String, default: null, select: false },
    isActive:     { type: Boolean, default: true },
    loginCount:   { type: Number, default: 0 },
    lastLogin:    { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
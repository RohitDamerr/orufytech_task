import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/emailService.js";

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    // Validate that identifier is an email
    if (!identifier) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(identifier)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    let user = await User.findOne({ identifier });
    if (!user) user = await User.create({ identifier });

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP via email
    await sendOtpEmail(identifier, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ 
      message: error.message || "Failed to send OTP. Please try again." 
    });
  }
};

export const sendLoginOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    // Validate that identifier is an email
    if (!identifier) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(identifier)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
  
    // Check if user exists
    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please sign up first.",
        code: "USER_NOT_FOUND"
      });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP via email
    await sendOtpEmail(identifier, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in sendLoginOtp:", error);
    res.status(500).json({ 
      message: error.message || "Failed to send OTP. Please try again." 
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { identifier, otp } = req.body;
  const user = await User.findOne({ identifier });

  if (!user || user.otp.toString() !== otp.toString() || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
};

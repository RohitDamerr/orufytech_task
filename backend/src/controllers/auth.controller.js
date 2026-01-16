import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/emailService.js";

// Generate secure 6-digit numeric OTP
const generateOtp = () => {
  // Use crypto for cryptographically secure random number
  // Generate random bytes and convert to 6-digit number (100000-999999)
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  // Ensure it's exactly 6 digits (100000 to 999999)
  return (100000 + (randomNumber % 900000)).toString();
};

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate that identifier is an email
    if (!isValidEmail(identifier)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Generate 6-digit OTP
    const otp = generateOtp();
    
    // Set expiry to 5 minutes (within 3-5 minute standard)
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    let user = await User.findOne({ identifier });
    if (!user) {
      user = await User.create({ identifier });
    }

    // Store OTP with expiry (unique per request)
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(identifier, otp);
      res.json({ message: "OTP sent to your email" });
    } catch (emailError) {
      console.error("Failed to send email, OTP logged to console:", emailError.message);
      // Fallback: log to console if email fails
      console.log(`OTP for ${identifier}: ${otp} (expires in 5 minutes)`);
      res.json({ message: "OTP sent (check console if email failed)" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

export const sendLoginOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate that identifier is an email
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

    // Generate 6-digit OTP
    const otp = generateOtp();
    
    // Set expiry to 5 minutes (within 3-5 minute standard)
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Store OTP with expiry (unique per request)
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(identifier, otp);
      res.json({ message: "OTP sent to your email" });
    } catch (emailError) {
      console.error("Failed to send email, OTP logged to console:", emailError.message);
      // Fallback: log to console if email fails
      console.log(`OTP for ${identifier}: ${otp} (expires in 5 minutes)`);
      res.json({ message: "OTP sent (check console if email failed)" });
    }
  } catch (error) {
    console.error("Error sending login OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP are required" });
    }

    const user = await User.findOne({ identifier });

    // Validate OTP: check if user exists, OTP matches, and not expired
    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      // Clear expired OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    // OTP is valid - delete it immediately (one-time use)
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP. Please try again." });
  }
};

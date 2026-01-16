import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const sendOtp = async (req, res) => {
  const { identifier } = req.body;
  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  let user = await User.findOne({ identifier });
  if (!user) user = await User.create({ identifier });

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  console.log("OTP:", otp); // 
  res.json({ message: "OTP sent" });
};

export const sendLoginOtp = async (req, res) => {
  const { identifier } = req.body;
  
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

  console.log("OTP:", otp); 
  res.json({ message: "OTP sent" });
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

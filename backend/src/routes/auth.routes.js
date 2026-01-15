import express from "express";
import { sendOtp, sendLoginOtp, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/send-otp", sendOtp); // For signup - creates user if doesn't exist
router.post("/send-login-otp", sendLoginOtp); // For login - checks if user exists
router.post("/verify-otp", verifyOtp);
export default router;

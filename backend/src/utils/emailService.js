import nodemailer from "nodemailer";

// Get email configuration from environment variables
const getEmailConfig = () => {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || "587");
  const secure = process.env.EMAIL_SECURE === "true" || false;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  // Return null if essential config is missing
  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  };
};

// Create transporter lazily - only when needed
let transporter = null;

const createTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const config = getEmailConfig();
  if (!config) {
    console.warn("Email configuration not found. OTP emails will not be sent.");
    return null;
  }

  transporter = nodemailer.createTransport(config);
  
  // Verify email configuration asynchronously (non-blocking)
  transporter.verify((error, success) => {
    if (error) {
      console.error("Email configuration error:", error.message);
      console.error("Please check your EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
    } else {
      console.log("Email server is ready to send messages");
    }
  });

  return transporter;
};

export const sendOtpEmail = async (email, otp) => {
  try {
    const emailTransporter = createTransporter();
    
    if (!emailTransporter) {
      throw new Error("Email service is not configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
    }

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;
    
    if (!fromEmail) {
      throw new Error("EMAIL_FROM or EMAIL_USER environment variable is required");
    }

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;">
            This OTP is valid for 5 minutes. Please do not share this code with anyone.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code is valid for 5 minutes.`,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw error;
  }
};

export default createTransporter;

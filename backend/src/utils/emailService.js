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
    // Connection timeout settings
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 5000, // 5 seconds
    // Enable debug logging
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
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

    // Set a timeout for the email sending operation
    const sendPromise = emailTransporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Email sending timeout after 10 seconds")), 10000);
    });

    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log("OTP email sent successfully to:", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMsg = error.message || "Unknown error";
    console.error("Error sending OTP email:", errorMsg);
    
    // Provide helpful error messages
    if (errorMsg.includes("timeout") || errorMsg.includes("ETIMEDOUT")) {
      console.error("\n⚠️  Email Connection Timeout:");
      console.error("Possible causes:");
      console.error("1. Incorrect EMAIL_HOST (should be 'smtp.gmail.com' for Gmail)");
      console.error("2. Firewall/network blocking SMTP port", process.env.EMAIL_PORT || 587);
      console.error("3. Wrong EMAIL_PORT (Gmail uses 587 for TLS or 465 for SSL)");
      console.error("4. EMAIL_SECURE setting mismatch (should be 'false' for port 587, 'true' for port 465)");
      console.error("5. Gmail requires app password (not regular password) - see: https://support.google.com/accounts/answer/185833\n");
    } else if (errorMsg.includes("auth") || errorMsg.includes("Invalid login")) {
      console.error("\n⚠️  Email Authentication Error:");
      console.error("For Gmail, you need to use an App Password:");
      console.error("1. Enable 2-Step Verification on your Google Account");
      console.error("2. Generate an App Password: https://myaccount.google.com/apppasswords");
      console.error("3. Use the 16-character app password as EMAIL_PASS\n");
    }
    
    throw error;
  }
};

export default createTransporter;

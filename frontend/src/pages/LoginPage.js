import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendLoginOtp, verifyOtp } from "../api/authApi";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [step, setStep] = useState("send");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier) {
      setError("Email or phone number is required");
      return;
    }

    setLoading(true);
    try {
      await sendLoginOtp(identifier);
      setStep("verify");
      setResendTimer(20);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err.response?.data?.code === "USER_NOT_FOUND") {
        setError("Account not found. Please sign up first.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);

    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 5) {
      setError("Please enter the complete 5-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(identifier, otpString);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendLoginOtp(identifier);
      setResendTimer(20);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err.response?.data?.code === "USER_NOT_FOUND") {
        setError("Account not found. Please sign up first.");
      } else {
        setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#f8fafc",
      display: "flex"
    }}>
      {/* Left side - Screenshot background */}
      <div style={{
        width: "55%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
        }}></div>
        <img
          src="/Screenshot (240).png"
          alt="Login Design"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(1.02)"
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Right side - Login form */}
      <div style={{
        width: "45%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.06)"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px"
        }}>
          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "48px",
            justifyContent: "center"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "700",
              color: "#fff"
            }}>
              P
            </div>
            <span style={{
              fontSize: "26px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Productr
            </span>
          </div>

          <h2 style={{
            marginBottom: "8px",
            fontSize: "30px",
            fontWeight: "700",
            color: "#0f172a",
            textAlign: "center",
            letterSpacing: "-0.5px"
          }}>
            Login to your Account
          </h2>
          <p style={{
            marginBottom: "40px",
            fontSize: "15px",
            color: "#64748b",
            textAlign: "center"
          }}>
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={step === "send" ? handleSendOtp : handleVerifyOtp}>
            {error && (
              <div style={{
                color: "#dc2626",
                marginBottom: "24px",
                padding: "14px 16px",
                backgroundColor: "#fef2f2",
                borderRadius: "10px",
                fontSize: "14px",
                border: "1px solid #fecaca",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                {error.includes("not found") && (
                  <Link 
                    to="/signup" 
                    style={{
                      marginTop: "8px",
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "inline-block"
                    }}
                  >
                    Go to Sign Up
                  </Link>
                )}
              </div>
            )}

            {step === "send" ? (
              <>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b"
                  }}>
                    Email or Phone number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email or phone number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      backgroundColor: "#fff",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                      color: "#0f172a"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.2s",
                    boxShadow: loading ? "none" : "0 4px 12px rgba(99, 102, 241, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = loading ? "none" : "0 4px 12px rgba(99, 102, 241, 0.3)";
                  }}
                >
                  {loading ? "Sending..." : "Login"}
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "32px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "20px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1e293b",
                    textAlign: "center"
                  }}>
                    Enter OTP
                  </label>
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center"
                  }}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        style={{
                          width: "60px",
                          height: "60px",
                          textAlign: "center",
                          fontSize: "26px",
                          fontWeight: "700",
                          border: "2px solid #e2e8f0",
                          borderRadius: "12px",
                          outline: "none",
                          backgroundColor: "#fff",
                          transition: "all 0.2s",
                          color: "#0f172a"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#6366f1";
                          e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.2s",
                    boxShadow: loading ? "none" : "0 4px 12px rgba(99, 102, 241, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = loading ? "none" : "0 4px 12px rgba(99, 102, 241, 0.3)";
                  }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <div style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#64748b"
                }}>
                  Didn't receive OTP?{" "}
                  {resendTimer > 0 ? (
                    <span style={{ color: "#6366f1", fontWeight: "600" }}>Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6366f1",
                        cursor: "pointer",
                        textDecoration: "none",
                        fontSize: "14px",
                        padding: 0,
                        fontWeight: "600"
                      }}
                    >
                      Resend
                    </button>
                  )}
                </div>
              </>
            )}
          </form>

          <div style={{
            marginTop: "32px",
            paddingTop: "32px",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0
            }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ 
                color: "#6366f1", 
                textDecoration: "none", 
                fontWeight: "600",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#8b5cf6"}
              onMouseLeave={(e) => e.target.style.color = "#6366f1"}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

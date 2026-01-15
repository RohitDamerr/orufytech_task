import api from "./api";

export const sendOtp = async (identifier) => {
  const res = await api.post("/auth/send-otp", { identifier });
  return res.data;
};

export const sendLoginOtp = async (identifier) => {
  const res = await api.post("/auth/send-login-otp", { identifier });
  return res.data;
};

export const verifyOtp = async (identifier, otp) => {
  const res = await api.post("/auth/verify-otp", { identifier, otp });
  return res.data;
};

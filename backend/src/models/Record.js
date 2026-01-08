import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    }
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: String,
    quantity: Number,
    mrp: Number,
    price: Number,
    brand: String,
    images: [String],
    exchangeEligible: Boolean,
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

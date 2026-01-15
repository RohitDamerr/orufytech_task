import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Product from "../models/Product.js";

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    type: "Electronics",
    quantity: 50,
    mrp: 2999,
    price: 1999,
    brand: "SoundMax",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    exchangeEligible: true,
    published: true
  },
  {
    name: "Smart Fitness Watch",
    type: "Wearables",
    quantity: 30,
    mrp: 8999,
    price: 6999,
    brand: "FitTech",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    ],
    exchangeEligible: false,
    published: true
  },
  {
    name: "Organic Coffee Beans",
    type: "Food & Beverages",
    quantity: 100,
    mrp: 899,
    price: 699,
    brand: "BeanCo",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"
    ],
    exchangeEligible: false,
    published: false
  },
  {
    name: "Leather Backpack",
    type: "Accessories",
    quantity: 25,
    mrp: 3499,
    price: 2499,
    brand: "TravelPro",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    exchangeEligible: true,
    published: true
  },
  {
    name: "Yoga Mat Premium",
    type: "Fitness",
    quantity: 75,
    mrp: 1499,
    price: 999,
    brand: "FlexFit",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
    ],
    exchangeEligible: false,
    published: true
  },
  {
    name: "Wireless Mouse",
    type: "Electronics",
    quantity: 60,
    mrp: 1299,
    price: 899,
    brand: "TechMouse",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"
    ],
    exchangeEligible: true,
    published: false
  },
  {
    name: "Stainless Steel Water Bottle",
    type: "Accessories",
    quantity: 120,
    mrp: 799,
    price: 599,
    brand: "HydroMax",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
    ],
    exchangeEligible: false,
    published: true
  },
  {
    name: "LED Desk Lamp",
    type: "Home & Office",
    quantity: 40,
    mrp: 1999,
    price: 1499,
    brand: "BrightLight",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    ],
    exchangeEligible: true,
    published: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    
    if (error.message.includes("Authentication failed") || error.code === 8000) {
      console.error("\n⚠️  MongoDB Authentication Error:");
      console.error("Please check your MongoDB Atlas credentials:");
      console.error("1. Verify your MONGO_URI in the .env file");
      console.error("2. Ensure your database user has the correct permissions");
      console.error("3. Check if your IP address is whitelisted in MongoDB Atlas");
      console.error("4. Verify your username and password are correct\n");
    } else if (error.message.includes("MONGO_URI")) {
      console.error("\n⚠️  Please set MONGO_URI in your .env file\n");
    }
    
    // Don't crash the app, but log the error
    // The app will continue to run but database operations will fail
    throw error;
  }
};

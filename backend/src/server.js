import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log("MongoDB connected")
);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

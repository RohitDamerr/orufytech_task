import express from "express";
import cors from "cors";
import recordRoutes from "./routes/record.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

export default app;

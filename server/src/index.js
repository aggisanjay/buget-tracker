import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import txRoutes from "./routes/transactions.routes.js";
import budgetRoutes from "./routes/budgets.routes.js";
import insightsRoutes from "./routes/insights.routes.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/insights", insightsRoutes);

app.use(errorHandler);

// ✅ VERCEL NEEDS AN EXPORT — NOT app.listen()
connectDB(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

export default app;
